import { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Activity, Globe, Server, Database, Settings as SettingsIcon } from 'lucide-react';
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

  const handleAnalyze = () => {
    if (!url.trim()) return;

    setIsScanning(true);
    setShowResults(false);

    setTimeout(() => {
      // Generate random risk assessment
      const riskLevels = [
        { risk: 'Bajo', color: 'emerald', scoreRange: [80, 99] },
        { risk: 'Medio', color: 'yellow', scoreRange: [50, 79] },
        { risk: 'Alto', color: 'red', scoreRange: [10, 49] },
        { risk: 'Crítico', color: 'red', scoreRange: [1, 9] }
      ];

      const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      const score = Math.floor(
        Math.random() * (randomRisk.scoreRange[1] - randomRisk.scoreRange[0] + 1) + randomRisk.scoreRange[0]
      );

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newResult: AnalysisResult = {
        id: Date.now(),
        url: url,
        date: dateStr,
        risk: randomRisk.risk,
        score: score,
        color: randomRisk.color
      };

      setCurrentResult(newResult);
      setHistory(prev => [newResult, ...prev]);
      setIsScanning(false);
      setShowResults(true);
      setUrl('');
    }, 3000);
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
                        <div className="h-40 bg-black/20 border border-cyan-500/30 rounded-xl overflow-hidden relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Activity className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                              <p className="text-cyan-300 font-semibold flex items-center justify-center gap-1">
                                Analizando seguridad
                                <span className="inline-flex gap-1">
                                  <span className="dot-bounce" style={{ animationDelay: '0s' }}>.</span>
                                  <span className="dot-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                                  <span className="dot-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                                </span>
                              </p>
                              <p className="text-gray-500 text-sm mt-1">Verificando certificados y reputación</p>
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
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        Análisis de Contenido
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Formularios Sospechosos</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> No detectados
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Scripts Maliciosos</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> No detectados
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Redirecciones</span>
                          <span className="text-yellow-400 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" /> 1 encontrada
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        Reputación del Dominio
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Antigüedad del Dominio</span>
                          <span className="text-white">3 años, 5 meses</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Lista Negra</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Limpio
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">DNSSEC</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Habilitado
                          </span>
                        </div>
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
      `}</style>
    </div>
  );
}
