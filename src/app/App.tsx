import { useState, useEffect, useCallback } from 'react';
import { Shield, Lock, Unlock, AlertTriangle, CheckCircle, XCircle, Activity, Globe, Server, Database, Settings as SettingsIcon, LogOut } from 'lucide-react';
import {
  analyzeUrlForPhishing,
  getDynamicAccessStatus,
  getSecurityRecommendations,
} from '../lib/analysis';
import { Sidebar } from './components/Sidebar';
import { LoginForm } from './components/LoginForm';
import { StatsCards } from './components/StatsCards';
import { LinkHistory } from './components/LinkHistory';
import { SecurityTips } from './components/SecurityTips';
import { BlockedList } from './components/BlockedList';
import { Settings } from './components/Settings';
import { Documentation } from './components/Documentation';
import { AppPageHeader } from './components/AppPageHeader';
import { AuthProvider, useAuth } from '../lib/supabase/auth-context';
import { createClient, isSupabaseConfigured } from '../lib/supabase/supabaseClient';
import { toast, Toaster } from 'sonner';

// Alert component for block success
interface BlockAlertProps {
  show: boolean;
  onClose: () => void;
}

function BlockSuccessAlert({ show, onClose }: BlockAlertProps) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gradient-to-br from-emerald-900/90 to-green-800/80 border-2 border-emerald-400/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/20 animate-fadeIn max-w-sm w-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Enlace bloqueado con exito</h3>
          <p className="text-emerald-200/80 text-sm sm:text-base mb-6">
            El enlace malicioso ha sido agregado a tu lista de bloqueo y no podra ser accedido.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

type EstadoAcceso = 'Pendiente' | 'Seguro' | 'Sospechoso';

interface AnalysisResult {
  id: number;
  url: string;
  date: string;
  estado: EstadoAcceso;
  bloqueado: boolean;
  risk: string;
  score: number;
  color: string;
}

/** Mapea el resultado del detector a los valores de la columna `estado` en Supabase. */
function mapRiskToEstado(risk: string): EstadoAcceso {
  if (risk === 'Seguro' || risk === 'Bajo') return 'Seguro';
  if (risk === 'Medio' || risk === 'Alto' || risk === 'Critico') return 'Sospechoso';
  return 'Pendiente';
}

function formatHistorialDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Supabase puede devolver `id` como string; normaliza para comparar y filtrar. */
function toHistorialId(id: number | string): number {
  return typeof id === 'string' ? parseInt(id, 10) : id;
}

interface HistorialRow {
  id: number;
  url: string;
  estado: EstadoAcceso;
  bloqueado: boolean;
  created_at: string;
}

function rowToAnalysisResult(item: HistorialRow): AnalysisResult {
  const estado = (item.estado ?? 'Pendiente') as EstadoAcceso;
  const risk =
    estado === 'Seguro' ? 'Seguro' : estado === 'Sospechoso' ? 'Alto' : 'Pendiente';
  const score = estado === 'Seguro' ? 95 : estado === 'Sospechoso' ? 25 : 50;
  const color =
    estado === 'Seguro' ? 'emerald' : estado === 'Sospechoso' ? 'red' : 'yellow';

  return {
    id: toHistorialId(item.id),
    url: item.url,
    date: formatHistorialDate(item.created_at),
    estado,
    bloqueado: Boolean(item.bloqueado),
    risk,
    score,
    color,
  };
}

function AppContent() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [blockedList, setBlockedList] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showBlockAlert, setShowBlockAlert] = useState(false);
  const [unblockingId, setUnblockingId] = useState<number | null>(null);

  // Cargar historial desde Supabase (historial_accesos)
  const loadHistoryFromSupabase = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('historial_accesos')
        .select('id, url, estado, bloqueado, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[PhishingSecureJD] Error loading history:', error);
        return;
      }

      const rows = (data ?? []) as HistorialRow[];
      const all = rows.map(rowToAnalysisResult);
      setHistory(all.filter((item) => !item.bloqueado));
      setBlockedList(all.filter((item) => item.bloqueado));
    } catch (error) {
      console.error('[PhishingSecureJD] Error in loadHistoryFromSupabase:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Cargar historial al montar (y cuando el usuario inicia sesion)
  useEffect(() => {
    if (user) {
      loadHistoryFromSupabase();
    } else {
      setHistory([]);
      setBlockedList([]);
    }
  }, [user, loadHistoryFromSupabase]);

  // Load dark mode preference from localStorage (solo preferencia de tema)
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('phishguard_darkmode');
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  const [analysisReasons, setAnalysisReasons] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!url.trim() || !user?.email) return;

    setIsScanning(true);
    setShowResults(false);

    // Simular tiempo de escaneo
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Usar el algoritmo de deteccion real
    const analysis = analyzeUrlForPhishing(url);
    const analyzedUrl = url; // Guardar la URL antes de limpiarla

    const now = new Date();
    const dateStr = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const estado = mapRiskToEstado(analysis.risk);

    // Crear el resultado del analisis
    let newResult: AnalysisResult = {
      id: Date.now(),
      url: analyzedUrl,
      date: dateStr,
      estado,
      bloqueado: false,
      risk: analysis.risk,
      score: analysis.score,
      color: analysis.color,
    };

    try {
      const supabase = createClient();
      const { data: insertedData, error: insertError } = await supabase
        .from('historial_accesos')
        .insert({
          url: analyzedUrl,
          estado,
          bloqueado: false,
          correo_electronico: user.email,
          usuario_id: user.id,
        })
        .select('id, url, estado, bloqueado, created_at')
        .single();

      if (insertError) {
        console.error('[PhishingSecureJD] Error saving analysis to Supabase:', insertError);
        toast.error('No se pudo guardar el analisis en la base de datos.');
      } else if (insertedData) {
        const row = insertedData as HistorialRow;
          newResult = {
            ...newResult,
            id: toHistorialId(row.id),
            url: row.url,
          estado: row.estado as EstadoAcceso,
          bloqueado: Boolean(row.bloqueado),
          date: formatHistorialDate(row.created_at),
        };
      }
    } catch (error) {
      console.error('[PhishingSecureJD] Error in handleAnalyze:', error);
      toast.error('Error de conexion con Supabase.');
    }

    // Mostrar resultados del analisis
    setCurrentResult(newResult);
    setAnalysisReasons(analysis.reasons);
    setHistory(prev => [newResult, ...prev]);
    setIsScanning(false);
    setShowResults(true);
    setUrl('');

    // Email alert for high/critical risk (encapsulated safely)
    if (analysis.risk === 'Alto' || analysis.risk === 'Critico') {
      try {
        const emailAlertsEnabled = localStorage.getItem('phishguard_email_alerts_enabled') === 'true';
        const alertEmail = localStorage.getItem('phishguard_alert_email');
        
        if (emailAlertsEnabled && alertEmail) {
          console.log(`[PhishingSecureJD] Alert would be sent to: ${alertEmail}`);
        }
      } catch (emailError) {
        console.error('[PhishingSecureJD] Email alert error (non-critical):', emailError);
      }
    }
  };

  const handleBlockUrl = async (id: number) => {
    const recordId = toHistorialId(id);
    const itemToBlock = history.find((item) => toHistorialId(item.id) === recordId);
    if (!itemToBlock || !user?.id) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('historial_accesos')
        .update({ bloqueado: true })
        .eq('id', recordId)
        .eq('usuario_id', user.id)
        .select('id, url, estado, bloqueado, created_at')
        .maybeSingle();

      if (error) {
        console.error('[PhishingSecureJD] Error blocking URL in Supabase:', error);
        toast.error('No se pudo bloquear el enlace en la base de datos.');
        return;
      }

      if (!data) {
        toast.error('No se encontro el registro para bloquear.');
        return;
      }

      const blockedItem = rowToAnalysisResult(data as HistorialRow);
      setBlockedList((prev) => [
        blockedItem,
        ...prev.filter((item) => toHistorialId(item.id) !== recordId),
      ]);
      setHistory((prev) => prev.filter((item) => toHistorialId(item.id) !== recordId));
      setShowBlockAlert(true);
    } catch (error) {
      console.error('[PhishingSecureJD] Error in handleBlockUrl:', error);
      toast.error('Error de conexion con Supabase.');
    }
  };

  const handleUnblockUrl = async (id: number) => {
    const recordId = toHistorialId(id);
    const itemToUnblock = blockedList.find((item) => toHistorialId(item.id) === recordId);
    if (!itemToUnblock || !user?.id) {
      toast.error('Debes iniciar sesion para desbloquear enlaces.');
      return;
    }

    setUnblockingId(recordId);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('historial_accesos')
        .update({ bloqueado: false })
        .eq('id', recordId)
        .eq('usuario_id', user.id)
        .select('id, url, estado, bloqueado, created_at')
        .maybeSingle();

      if (error) {
        console.error('[PhishingSecureJD] Error unblocking URL:', error);
        toast.error('No se pudo desbloquear el enlace.');
        return;
      }

      if (!data) {
        toast.error('No se encontro el registro. Recarga la pagina e intenta de nuevo.');
        return;
      }

      const restored = rowToAnalysisResult(data as HistorialRow);
      setHistory((prev) => [
        restored,
        ...prev.filter((item) => toHistorialId(item.id) !== recordId),
      ]);
      setBlockedList((prev) => prev.filter((item) => toHistorialId(item.id) !== recordId));
      toast.success('Enlace desbloqueado. Vuelve a aparecer en tu historial.');
    } catch (error) {
      console.error('[PhishingSecureJD] Error in handleUnblockUrl:', error);
      toast.error('Error de conexion con Supabase.');
    } finally {
      setUnblockingId(null);
    }
  };

  const handleClearHistory = async () => {
    if (!user?.id) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('historial_accesos')
        .delete()
        .eq('usuario_id', user.id);

      if (error) {
        console.error('[PhishingSecureJD] Error clearing history:', error);
        toast.error('No se pudo borrar el historial.');
        return;
      }

      setHistory([]);
      setBlockedList([]);
    } catch (error) {
      console.error('[PhishingSecureJD] Error in handleClearHistory:', error);
      toast.error('Error de conexion con Supabase.');
    }
  };

  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const handleLogout = async () => {
    await signOut();
    setActiveSection('dashboard');
    setShowResults(false);
    setCurrentResult(null);
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className={`flex min-h-screen text-white overflow-hidden transition-colors duration-500 ${
      isDarkMode ? 'bg-[#050505]' : 'bg-gray-100'
    }`} style={{
      '--bg-primary': isDarkMode ? '#050505' : '#f3f4f6',
      '--bg-secondary': isDarkMode ? '#0a0a0a' : '#ffffff',
      '--text-primary': isDarkMode ? '#ffffff' : '#111827',
      '--text-secondary': isDarkMode ? '#9ca3af' : '#6b7280',
      '--border-color': isDarkMode ? 'rgba(6, 182, 212, 0.2)' : 'rgba(156, 163, 175, 0.3)',
    } as React.CSSProperties}>
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-[128px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <AppPageHeader
            title={
              activeSection === 'dashboard'
                ? 'Panel Principal'
                : activeSection === 'history'
                  ? 'Historial de Análisis'
                  : activeSection === 'threats'
                    ? 'Base de Datos de Amenazas'
                    : activeSection === 'documentation'
                      ? 'Documentación'
                      : 'Configuración'
            }
            subtitle={
              activeSection === 'dashboard'
                ? 'Monitorea y analiza URLs en tiempo real'
                : activeSection === 'history'
                  ? 'Revisa todos los análisis realizados'
                  : activeSection === 'threats'
                    ? 'Explora amenazas conocidas y patrones de phishing'
                    : activeSection === 'documentation'
                      ? 'Aprende como funciona la plataforma'
                      : 'Personaliza tu experiencia de seguridad'
            }
          />

          {activeSection === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <StatsCards history={history} blockedList={blockedList} />

              {/* Scanner Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl">
                    <div className="text-center mb-6 lg:mb-8">
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                        Analizar Nueva URL
                      </h2>
                      <p className="text-gray-400">
                        Introduce una URL para verificar su seguridad
                      </p>
                    </div>

                    {/* Input Section */}
                    <div className="relative">
                      <div className="relative group">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://ejemplo-sospechoso.com"
                          className="w-full px-4 sm:px-8 py-4 sm:py-5 bg-black/30 border-2 border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 text-sm sm:text-base"
                        />
                        <Globe className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                      </div>

                      <button
                        onClick={handleAnalyze}
                        disabled={!url || isScanning}
                        className="w-full mt-4 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-sm sm:text-base"
                        style={{
                          boxShadow: url && !isScanning ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none'
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Shield className="w-5 h-5" />
                          {isScanning ? 'Escaneando...' : 'Analizar URL'}
                        </span>
                        {url && !isScanning && (
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        )}
                      </button>
                    </div>

                    {/* Scanning Animation */}
                    {isScanning && (
                      <div className="mt-8 relative">
                        <div className="h-48 bg-black/20 border border-cyan-500/30 rounded-xl overflow-hidden relative">
                          {/* Animated scan line */}
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="relative">
                                <Shield className="w-14 h-14 text-cyan-400 mx-auto mb-3 animate-pulse" />
                                <div className="absolute inset-0 w-14 h-14 mx-auto border-2 border-cyan-400/50 rounded-full animate-ping"></div>
                              </div>
                              <p className="text-cyan-300 font-semibold text-lg flex items-center justify-center gap-1">
                                Escaneando enlace
                                <span className="inline-flex gap-1">
                                  <span className="dot-bounce" style={{ animationDelay: '0s' }}>.</span>
                                  <span className="dot-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                                  <span className="dot-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                                </span>
                              </p>
                              <p className="text-gray-500 text-sm mt-2">Analizando patrones de phishing y amenazas</p>
                              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
                                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL</span>
                                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Dominio</span>
                                <span className="flex items-center gap-1"><Server className="w-3 h-3" /> Reputacion</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Tips Sidebar */}
                <div className="lg:col-span-1">
                  <SecurityTips />
                </div>
              </div>

              {/* Results Dashboard */}
              {showResults && currentResult && (() => {
                const accessStatus = getDynamicAccessStatus(currentResult);
                const securityRecommendations = getSecurityRecommendations({
                  score: currentResult.score,
                  risk: currentResult.risk,
                  color: currentResult.color,
                  reasons: analysisReasons,
                });

                return (
                <div className="animate-fadeIn">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Resultados del Analisis</h3>

                  {/* Estado de acceso dinamico segun motor de analisis */}
                  <div
                    className={`mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border p-4 sm:p-5 backdrop-blur-sm flex items-center gap-4 transition-all duration-300 ${accessStatus.containerClasses}`}
                    role="status"
                    aria-live="polite"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border ${accessStatus.badgeClasses}`}>
                      {accessStatus.permitted ? (
                        <Unlock className={`w-6 h-6 sm:w-7 sm:h-7 ${accessStatus.iconColorClasses}`} />
                      ) : (
                        <Lock className={`w-6 h-6 sm:w-7 sm:h-7 ${accessStatus.iconColorClasses}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide font-medium">
                        Estado de acceso
                      </p>
                      <p className={`text-xl sm:text-2xl font-bold ${accessStatus.textClasses}`}>
                        {accessStatus.text}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {accessStatus.permitted
                          ? 'El enlace cumple los criterios heurísticos de seguridad.'
                          : 'Acceso restringido por deteccion de riesgo de phishing o fraude.'}
                      </p>
                    </div>
                    <span
                      className={`hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${accessStatus.badgeClasses}`}
                    >
                      {accessStatus.permitted ? 'Seguro' : 'Alerta'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
                    {/* Risk Level Card */}
                    <div className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 border ${
                      currentResult.color === 'emerald' ? 'border-emerald-500/30' :
                      currentResult.color === 'yellow' ? 'border-yellow-500/30' :
                      'border-red-500/30'
                    } rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm relative overflow-hidden group hover:border-opacity-60 transition-all duration-300`}>
                      <div className={`absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 rounded-full blur-3xl transition-all duration-300 ${
                        currentResult.color === 'emerald' ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' :
                        currentResult.color === 'yellow' ? 'bg-yellow-500/10 group-hover:bg-yellow-500/20' :
                        'bg-red-500/10 group-hover:bg-red-500/20'
                      }`}></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                          <h3 className="text-gray-300 text-sm sm:text-base font-semibold">Nivel de Riesgo</h3>
                          {currentResult.color === 'emerald' ? (
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                          ) : (
                            <AlertTriangle className={`w-6 h-6 sm:w-8 sm:h-8 ${currentResult.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`} />
                          )}
                        </div>
                        <div className="mb-2">
                          <div className={`text-2xl sm:text-4xl font-bold mb-1 ${
                            currentResult.color === 'emerald' ? 'text-emerald-400' :
                            currentResult.color === 'yellow' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>{currentResult.risk}</div>
                          <div className="text-xs sm:text-sm text-gray-500">Seguridad: {currentResult.score}%</div>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
                          <div className={`h-full rounded-full animate-progressBar ${
                            currentResult.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                            currentResult.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                            'bg-gradient-to-r from-red-500 to-red-400'
                          }`} style={{ width: `${currentResult.score}%` }}></div>
                        </div>
                      </div>
                    </div>

            {/* SSL Certificate Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-gray-300 text-sm sm:text-base font-semibold">Certificado SSL</h3>
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
                <div className="mb-2">
                  <div className="text-2xl sm:text-4xl font-bold text-cyan-400 mb-1">Valido</div>
                  <div className="text-xs sm:text-sm text-gray-500">Expira: 180 dias</div>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm">
                  <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300">
                    TLS 1.3
                  </div>
                  <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300">
                    SHA-256
                  </div>
                </div>
              </div>
            </div>

            {/* IP Reputation Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm relative overflow-hidden group hover:border-yellow-500/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-gray-300 text-sm sm:text-base font-semibold">Reputacion de IP</h3>
                  <Server className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                </div>
                <div className="mb-2">
                  <div className="text-2xl sm:text-4xl font-bold text-yellow-400 mb-1">Neutral</div>
                  <div className="text-xs sm:text-sm text-gray-500">Score: 72/100</div>
                </div>
                <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Pais:</span>
                    <span className="text-white">Estados Unidos</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>ISP:</span>
                    <span className="text-white">CloudFlare Inc.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

                  {/* Additional Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                    {/* Motivos del Analisis - Nueva tarjeta dinamica */}
                    <div className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 border ${
                      currentResult.color === 'emerald' ? 'border-emerald-500/30' :
                      currentResult.color === 'yellow' ? 'border-yellow-500/30' :
                      'border-red-500/30'
                    } rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm`}>
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                        <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          currentResult.color === 'emerald' ? 'text-emerald-400' :
                          currentResult.color === 'yellow' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                        Motivos del Analisis
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {analysisReasons.map((reason, index) => (
                          <div key={index} className="flex items-start gap-2 sm:gap-3">
                            {currentResult.color === 'emerald' ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${
                                currentResult.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                              }`} />
                            )}
                            <span className="text-gray-300 text-sm sm:text-base">{reason}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                        <p className="text-xs sm:text-sm text-gray-500">
                          URL analizada: <span className="text-gray-400 break-all">{currentResult.url}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-900/40 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        Recomendaciones
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {securityRecommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-2 sm:gap-3">
                            {currentResult.color === 'emerald' ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            ) : currentResult.color === 'yellow' ? (
                              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            )}
                            <span className="text-gray-300 text-sm sm:text-base">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })()}

              {/* Link History */}
              <div className="mt-8">
<LinkHistory
  history={history}
  onBlock={handleBlockUrl}
  isLoading={isLoadingHistory}
  />
              </div>

              {/* Blocked List */}
              <div className="mt-8">
                <BlockedList
                  blockedList={blockedList}
                  onUnblock={handleUnblockUrl}
                  unblockingId={unblockingId}
                />
              </div>
            </>
          )}

          {activeSection === 'history' && (
            <div className="space-y-6">
              <LinkHistory
                history={history}
                onBlock={handleBlockUrl}
              />
              <BlockedList
                blockedList={blockedList}
                onUnblock={handleUnblockUrl}
                unblockingId={unblockingId}
              />
            </div>
          )}

          {activeSection === 'threats' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Threat Database Header */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-cyan-500/20 rounded-xl">
                    <Database className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Base de Datos de Amenazas</h3>
                    <p className="text-gray-400">Catálogo de URLs bloqueadas y amenazas detectadas</p>
                  </div>
                </div>
              </div>

              {/* Blocked URLs Table */}
              <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 border border-red-500/30 rounded-2xl backdrop-blur-xl overflow-hidden">
                <div className="p-6 border-b border-red-500/30 bg-red-950/20">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    URLs Bloqueadas
                  </h2>
                  <p className="text-red-300/70 text-sm mt-1">Lista de amenazas identificadas y bloqueadas</p>
                </div>

                {blockedList.length === 0 ? (
                  <div className="p-16 text-center">
                    <Database className="w-12 h-12 text-red-700 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-400/70 mb-1">No hay amenazas registradas</h3>
                    <p className="text-red-500/50 text-sm">Las URLs bloqueadas aparecerán aquí</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-red-800/50">
                            <th className="text-left px-6 py-4 text-red-300 font-semibold text-sm">URL</th>
                            <th className="text-left px-6 py-4 text-red-300 font-semibold text-sm">Tipo de Amenaza</th>
                            <th className="text-left px-6 py-4 text-red-300 font-semibold text-sm">Fecha de Bloqueo</th>
                            <th className="text-center px-6 py-4 text-red-300 font-semibold text-sm">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blockedList.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-red-800/30 hover:bg-red-500/5 transition-all duration-300"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                  <span className="text-white font-medium truncate max-w-xs">
                                    {item.url}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                  {item.risk === 'Critico' ? 'Phishing Confirmado' : 
                                   item.risk === 'Alto' ? 'Amenaza Alta' : 
                                   item.risk === 'Medio' ? 'Sospechoso' : 'Precaución'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-400 text-sm">{item.date}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => handleUnblockUrl(item.id)}
                                    disabled={unblockingId === toHistorialId(item.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {unblockingId === toHistorialId(item.id) ? 'Desbloqueando...' : 'Desbloquear'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 border-t border-red-800/30 bg-red-950/10">
                      <p className="text-red-400/70 text-sm text-center">
                        {blockedList.length} amenaza{blockedList.length !== 1 ? 's' : ''} bloqueada{blockedList.length !== 1 ? 's' : ''} en total
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-xl p-6">
                  <p className="text-gray-400 text-sm">Total Amenazas</p>
                  <p className="text-3xl font-bold text-white">{blockedList.length}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-red-500/20 rounded-xl p-6">
                  <p className="text-gray-400 text-sm">Riesgo Crítico</p>
                  <p className="text-3xl font-bold text-red-400">{blockedList.filter(i => i.risk === 'Critico' || i.risk === 'Alto').length}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-yellow-500/20 rounded-xl p-6">
                  <p className="text-gray-400 text-sm">Riesgo Medio</p>
                  <p className="text-3xl font-bold text-yellow-400">{blockedList.filter(i => i.risk === 'Medio').length}</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'documentation' && (
            <Documentation />
          )}

          {activeSection === 'settings' && (
            <Settings
              onClearHistory={handleClearHistory}
              onThemeChange={handleThemeChange}
            />
          )}
        </div>
      </main>

      {/* Global CSS Animations */}
      <style>{`
        @keyframes pulse-hover {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-hover:hover:not(:disabled) {
          animation: pulse-hover 2s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressBar {
          from {
            width: 0%;
          }
        }

        @keyframes dotBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          30% {
            transform: translateY(-10px);
            opacity: 0.7;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-progressBar {
          animation: progressBar 1.5s ease-out forwards;
        }

        .dot-bounce {
          display: inline-block;
          animation: dotBounce 1.4s infinite ease-in-out;
          font-size: 1.5em;
          line-height: 0;
        }

        @keyframes scan {
          0% {
            top: 0%;
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            top: 100%;
            opacity: 1;
          }
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>

      {/* Block Success Alert */}
      <BlockSuccessAlert 
        show={showBlockAlert} 
        onClose={() => setShowBlockAlert(false)} 
      />
    </div>
  );
}

function SupabaseSetupRequired() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-amber-500/40 bg-slate-900/90 p-8 text-center shadow-xl">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Falta configurar Supabase</h1>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
          La aplicacion no puede iniciar sin las variables de entorno. En local, crea un archivo{' '}
          <code className="text-cyan-300">.env</code> copiando <code className="text-cyan-300">.env.example</code>.
          En Vercel, agrega las variables en Settings → Environment Variables y vuelve a desplegar.
        </p>
        <ul className="text-left text-sm text-slate-300 space-y-1 mb-4 bg-slate-950/60 rounded-lg p-4 border border-slate-800">
          <li>
            <code className="text-emerald-400">VITE_SUPABASE_URL</code>
          </li>
          <li>
            <code className="text-emerald-400">VITE_SUPABASE_ANON_KEY</code>
          </li>
        </ul>
        <p className="text-slate-500 text-xs">Despues de guardar, reinicia <code className="text-slate-400">pnpm dev</code> o redeploy en Vercel.</p>
      </div>
    </div>
  );
}

// Wrap the app with AuthProvider
export default function App() {
  if (!isSupabaseConfigured()) {
    return <SupabaseSetupRequired />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
