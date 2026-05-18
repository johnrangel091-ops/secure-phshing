import { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, XCircle, Activity, Globe, Server, Database, Settings as SettingsIcon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { LoginForm } from './components/LoginForm';
import { StatsCards } from './components/StatsCards';
import { LinkHistory } from './components/LinkHistory';
import { SecurityTips } from './components/SecurityTips';
import { BlockedList } from './components/BlockedList';
import { Settings } from './components/Settings';

interface AnalysisResult {
  id: number;
  url: string;
  date: string;
  risk: string;
  score: number;
  color: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [blockedList, setBlockedList] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('phishguard_history');
    const savedBlocked = localStorage.getItem('phishguard_blocked');
    const savedDarkMode = localStorage.getItem('phishguard_darkmode');

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedBlocked) {
      setBlockedList(JSON.parse(savedBlocked));
    }
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Save to localStorage whenever history or blockedList changes
  useEffect(() => {
    localStorage.setItem('phishguard_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('phishguard_blocked', JSON.stringify(blockedList));
  }, [blockedList]);

  // Lista de dominios seguros conocidos
  const safeDomains = [
    'google.com', 'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
    'youtube.com', 'amazon.com', 'microsoft.com', 'apple.com', 'netflix.com',
    'github.com', 'stackoverflow.com', 'reddit.com', 'wikipedia.org', 'yahoo.com',
    'outlook.com', 'live.com', 'office.com', 'dropbox.com', 'spotify.com',
    'twitch.tv', 'paypal.com', 'ebay.com', 'walmart.com', 'target.com',
    'bestbuy.com', 'adobe.com', 'salesforce.com', 'zoom.us', 'slack.com',
    'vercel.com', 'notion.so', 'figma.com', 'canva.com', 'trello.com'
  ];

  // Palabras clave sospechosas comunes en phishing
  const suspiciousKeywords = [
    'login', 'signin', 'sign-in', 'account', 'verify', 'verification', 'update',
    'secure', 'security', 'bank', 'banco', 'banking', 'password', 'credential',
    'suspend', 'suspended', 'locked', 'unlock', 'confirm', 'confirmation',
    'urgent', 'alert', 'warning', 'winner', 'prize', 'reward', 'free', 'gift',
    'click', 'support', 'soporte', 'help', 'helpdesk', 'service', 'customer',
    'wallet', 'crypto', 'bitcoin', 'payment', 'pago', 'invoice', 'factura',
    'actualizar', 'verificar', 'seguridad', 'contraseña', 'cuenta'
  ];

  // Extensiones de dominio sospechosas
  const suspiciousExtensions = [
    '.xyz', '.top', '.club', '.info', '.online', '.site', '.website', '.tk',
    '.ml', '.ga', '.cf', '.gq', '.pw', '.cc', '.ws', '.buzz', '.work'
  ];

  // Funcion para analizar la URL y detectar phishing
  const analyzeUrlForPhishing = (inputUrl: string): { score: number; risk: string; color: string; reasons: string[] } => {
    const reasons: string[] = [];
    let dangerScore = 0;

    // Normalizar URL
    let normalizedUrl = inputUrl.toLowerCase().trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    let hostname = '';
    let pathname = '';
    try {
      const urlObj = new URL(normalizedUrl);
      hostname = urlObj.hostname;
      pathname = urlObj.pathname + urlObj.search;
    } catch {
      // URL invalida
      reasons.push('URL con formato invalido o sospechoso');
      dangerScore += 30;
      hostname = normalizedUrl;
    }

    // 1. Verificar si es un dominio seguro conocido
    const isSafeDomain = safeDomains.some(safe => {
      return hostname === safe || hostname === 'www.' + safe || hostname.endsWith('.' + safe);
    });

    if (isSafeDomain) {
      return {
        score: 95,
        risk: 'Seguro',
        color: 'emerald',
        reasons: ['Dominio verificado y confiable']
      };
    }

    // 2. Verificar subdominios excesivos (mas de 3 puntos)
    const subdomainCount = (hostname.match(/\./g) || []).length;
    if (subdomainCount > 2) {
      reasons.push('Multiples subdominios sospechosos detectados');
      dangerScore += 25;
    }

    // 3. Verificar palabras clave sospechosas en el dominio o ruta
    const fullUrl = hostname + pathname;
    const foundKeywords: string[] = [];
    suspiciousKeywords.forEach(keyword => {
      if (fullUrl.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });

    if (foundKeywords.length > 0) {
      reasons.push(`Palabras clave sospechosas: ${foundKeywords.slice(0, 3).join(', ')}`);
      dangerScore += Math.min(foundKeywords.length * 10, 40);
    }

    // 4. Verificar extension de dominio sospechosa
    const hasSuspiciousExtension = suspiciousExtensions.some(ext => hostname.endsWith(ext));
    if (hasSuspiciousExtension) {
      reasons.push('Extension de dominio de alto riesgo');
      dangerScore += 20;
    }

    // 5. Verificar si imita dominios conocidos (typosquatting)
    const typosquattingPatterns = [
      { pattern: /g[o0]{2}gle|go+gle|googl[e3]/i, brand: 'Google' },
      { pattern: /faceb[o0]{2}k|fac[e3]book|faceb00k/i, brand: 'Facebook' },
      { pattern: /amaz[o0]n|amazon[0-9]/i, brand: 'Amazon' },
      { pattern: /micr[o0]s[o0]ft|microsoft[0-9]/i, brand: 'Microsoft' },
      { pattern: /app[l1]e|apple[0-9]/i, brand: 'Apple' },
      { pattern: /netfl[i1]x|netflix[0-9]/i, brand: 'Netflix' },
      { pattern: /paypa[l1]|paypal[0-9]/i, brand: 'PayPal' },
      { pattern: /bank[o0]f|[a-z]+bank/i, brand: 'Banco' }
    ];

    for (const { pattern, brand } of typosquattingPatterns) {
      if (pattern.test(hostname) && !safeDomains.some(safe => hostname.includes(safe))) {
        reasons.push(`Posible imitacion de ${brand} (typosquatting)`);
        dangerScore += 35;
        break;
      }
    }

    // 6. Verificar caracteres sospechosos (homoglyphs)
    const homoglyphPattern = /[а-яА-Яα-ωА-Ω0-9]/;
    if (homoglyphPattern.test(hostname.replace(/[a-zA-Z0-9.-]/g, ''))) {
      reasons.push('Caracteres unicode sospechosos detectados');
      dangerScore += 30;
    }

    // 7. Verificar IP directa en lugar de dominio
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}/;
    if (ipPattern.test(hostname)) {
      reasons.push('Uso de direccion IP en lugar de dominio');
      dangerScore += 25;
    }

    // 8. Verificar longitud excesiva del dominio
    if (hostname.length > 30) {
      reasons.push('Dominio inusualmente largo');
      dangerScore += 15;
    }

    // 9. Verificar guiones multiples
    if ((hostname.match(/-/g) || []).length > 2) {
      reasons.push('Multiples guiones en el dominio');
      dangerScore += 15;
    }

    // 10. Verificar numeros aleatorios en el dominio
    if (/\d{4,}/.test(hostname)) {
      reasons.push('Secuencia de numeros sospechosa en dominio');
      dangerScore += 20;
    }

    // Calcular puntuacion final de seguridad (100 - dangerScore)
    const securityScore = Math.max(0, Math.min(100, 100 - dangerScore));

    // Determinar nivel de riesgo
    let risk: string;
    let color: string;

    if (securityScore >= 80) {
      risk = 'Bajo';
      color = 'emerald';
      if (reasons.length === 0) {
        reasons.push('No se detectaron patrones de phishing');
      }
    } else if (securityScore >= 50) {
      risk = 'Medio';
      color = 'yellow';
    } else if (securityScore >= 20) {
      risk = 'Alto';
      color = 'red';
    } else {
      risk = 'Critico';
      color = 'red';
    }

    return { score: securityScore, risk, color, reasons };
  };

  const [analysisReasons, setAnalysisReasons] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (!url.trim()) return;

    setIsScanning(true);
    setShowResults(false);

    setTimeout(() => {
      // Usar el algoritmo de deteccion real
      const analysis = analyzeUrlForPhishing(url);

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newResult: AnalysisResult = {
        id: Date.now(),
        url: url,
        date: dateStr,
        risk: analysis.risk,
        score: analysis.score,
        color: analysis.color
      };

      setCurrentResult(newResult);
      setAnalysisReasons(analysis.reasons);
      setHistory(prev => [newResult, ...prev]);
      setIsScanning(false);
      setShowResults(true);
      setUrl('');
    }, 2000);
  };

  const handleBlockUrl = (id: number) => {
    const itemToBlock = history.find(item => item.id === id);
    if (itemToBlock) {
      setBlockedList(prev => [itemToBlock, ...prev]);
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleUnblockUrl = (id: number) => {
    const itemToUnblock = blockedList.find(item => item.id === id);
    if (itemToUnblock) {
      setHistory(prev => [itemToUnblock, ...prev]);
      setBlockedList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setBlockedList([]);
    localStorage.removeItem('phishguard_history');
    localStorage.removeItem('phishguard_blocked');
  };

  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
    setShowResults(false);
    setCurrentResult(null);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
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
      <main className="flex-1 overflow-auto">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-[128px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {activeSection === 'dashboard' && 'Panel Principal'}
              {activeSection === 'history' && 'Historial de Análisis'}
              {activeSection === 'threats' && 'Base de Datos de Amenazas'}
              {activeSection === 'settings' && 'Configuración'}
            </h1>
            <p className="text-gray-400">
              {activeSection === 'dashboard' && 'Monitorea y analiza URLs en tiempo real'}
              {activeSection === 'history' && 'Revisa todos los análisis realizados'}
              {activeSection === 'threats' && 'Explora amenazas conocidas y patrones de phishing'}
              {activeSection === 'settings' && 'Personaliza tu experiencia de seguridad'}
            </p>
          </div>

          {activeSection === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <StatsCards />

              {/* Scanner Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-xl">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
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
                          className="w-full px-8 py-5 bg-black/30 border-2 border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all duration-300"
                        />
                        <Globe className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                      </div>

                      <button
                        onClick={handleAnalyze}
                        disabled={!url || isScanning}
                        className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group animate-pulse-hover"
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
              {showResults && currentResult && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-white mb-4">Resultados del Análisis</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {/* Risk Level Card */}
                    <div className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 border ${
                      currentResult.color === 'emerald' ? 'border-emerald-500/30' :
                      currentResult.color === 'yellow' ? 'border-yellow-500/30' :
                      'border-red-500/30'
                    } rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-opacity-60 transition-all duration-300`}>
                      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-all duration-300 ${
                        currentResult.color === 'emerald' ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' :
                        currentResult.color === 'yellow' ? 'bg-yellow-500/10 group-hover:bg-yellow-500/20' :
                        'bg-red-500/10 group-hover:bg-red-500/20'
                      }`}></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-gray-300 font-semibold">Nivel de Riesgo</h3>
                          {currentResult.color === 'emerald' ? (
                            <CheckCircle className="w-8 h-8 text-emerald-400" />
                          ) : (
                            <AlertTriangle className={`w-8 h-8 ${currentResult.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`} />
                          )}
                        </div>
                        <div className="mb-2">
                          <div className={`text-4xl font-bold mb-1 ${
                            currentResult.color === 'emerald' ? 'text-emerald-400' :
                            currentResult.color === 'yellow' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>{currentResult.risk}</div>
                          <div className="text-sm text-gray-500">Seguridad: {currentResult.score}%</div>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div className={`h-full rounded-full animate-progressBar ${
                            currentResult.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                            currentResult.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                            'bg-gradient-to-r from-red-500 to-red-400'
                          }`} style={{ width: `${currentResult.score}%` }}></div>
                        </div>
                      </div>
                    </div>

            {/* SSL Certificate Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-300 font-semibold">Certificado SSL</h3>
                  <Lock className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-cyan-400 mb-1">Válido</div>
                  <div className="text-sm text-gray-500">Expira: 180 días</div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300">
                    TLS 1.3
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300">
                    SHA-256
                  </div>
                </div>
              </div>
            </div>

            {/* IP Reputation Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-yellow-500/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-300 font-semibold">Reputación de IP</h3>
                  <Server className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-yellow-400 mb-1">Neutral</div>
                  <div className="text-sm text-gray-500">Score: 72/100</div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>País:</span>
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
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Motivos del Analisis - Nueva tarjeta dinamica */}
                    <div className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 border ${
                      currentResult.color === 'emerald' ? 'border-emerald-500/30' :
                      currentResult.color === 'yellow' ? 'border-yellow-500/30' :
                      'border-red-500/30'
                    } rounded-2xl p-6 backdrop-blur-sm`}>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className={`w-5 h-5 ${
                          currentResult.color === 'emerald' ? 'text-emerald-400' :
                          currentResult.color === 'yellow' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                        Motivos del Analisis
                      </h3>
                      <div className="space-y-3">
                        {analysisReasons.map((reason, index) => (
                          <div key={index} className="flex items-start gap-3">
                            {currentResult.color === 'emerald' ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                currentResult.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                              }`} />
                            )}
                            <span className="text-gray-300">{reason}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-500">
                          URL analizada: <span className="text-gray-400 break-all">{currentResult.url}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        Recomendaciones
                      </h3>
                      <div className="space-y-3">
                        {currentResult.color === 'emerald' ? (
                          <>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">Este sitio parece seguro para navegar</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">Verifica siempre que la URL sea la oficial</span>
                            </div>
                          </>
                        ) : currentResult.color === 'yellow' ? (
                          <>
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">Procede con precaucion al navegar</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">No ingreses datos personales sensibles</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">Verifica la autenticidad del sitio</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-start gap-3">
                              <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">NO navegues en este sitio</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">No ingreses ninguna informacion personal</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">Reporta este sitio como sospechoso</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">Considera bloquear esta URL</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Link History */}
              <div className="mt-8">
                <LinkHistory
                  history={history}
                  onBlock={handleBlockUrl}
                />
              </div>

              {/* Blocked List */}
              <div className="mt-8">
                <BlockedList
                  blockedList={blockedList}
                  onUnblock={handleUnblockUrl}
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
              />
            </div>
          )}

          {activeSection === 'threats' && (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-12 backdrop-blur-xl text-center animate-fadeIn">
              <Database className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Base de Datos de Amenazas</h3>
              <p className="text-gray-400 mb-6">Esta sección mostrará un catálogo de amenazas conocidas y patrones de phishing detectados.</p>
              <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-semibold transition-all duration-300">
                Explorar Amenazas
              </button>
            </div>
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
    </div>
  );
}
