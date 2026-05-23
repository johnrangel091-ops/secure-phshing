import { 
  Shield, 
  Search, 
  Database, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Eye,
  Ban,
  FileText,
  Cloud,
  Cpu,
  ArrowRight,
  UserCheck,
  ClipboardPaste,
  MousePointer,
  FileCheck,
  Sparkles,
  Layers,
  Server,
  Key
} from 'lucide-react';

export function Documentation() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Section - Que hace la app */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-cyan-500/30 to-blue-500/20 rounded-xl sm:rounded-2xl border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                Que hace PhishingSecureJD?
              </h2>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                Entrenamiento y seguridad contra amenazas de phishing
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span className="font-semibold text-white text-sm sm:text-base">Analisis de URLs</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Escanea cualquier enlace sospechoso antes de visitarlo para detectar posibles amenazas de phishing.
              </p>
            </div>
            
            <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="font-semibold text-white text-sm sm:text-base">Entrenamiento</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Aprende a identificar patrones de phishing y mejora tu seguridad digital con cada analisis.
              </p>
            </div>
            
            <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Ban className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <span className="font-semibold text-white text-sm sm:text-base">Bloqueo de Amenazas</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Bloquea enlaces maliciosos identificados y mantenlos en tu lista personal de amenazas.
              </p>
            </div>
            
            <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <span className="font-semibold text-white text-sm sm:text-base">Reportes PDF</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Exporta reportes detallados de cada analisis en formato PDF para documentacion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* APIs Section */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500/30 to-indigo-500/20 rounded-xl border border-blue-400/30">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">APIs y Tecnologias</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Stack tecnologico de la plataforma</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Supabase Auth */}
          <div className="bg-black/30 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Key className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-semibold text-white block text-sm sm:text-base">Supabase Auth</span>
                <span className="text-emerald-400 text-[10px] sm:text-xs">Autenticacion</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Sistema de autenticacion seguro con email y contrasena. Manejo de sesiones y proteccion de rutas.
            </p>
          </div>

          {/* Supabase Database */}
          <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="font-semibold text-white block text-sm sm:text-base">Supabase Database</span>
                <span className="text-cyan-400 text-[10px] sm:text-xs">Datos en la nube</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Base de datos PostgreSQL para almacenar historial de analisis, URLs bloqueadas y configuraciones por usuario.
            </p>
          </div>

          {/* Detection Engine */}
          <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group sm:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <span className="font-semibold text-white block text-sm sm:text-base">Motor de Deteccion Local</span>
                <span className="text-yellow-400 text-[10px] sm:text-xs">Algoritmo propietario</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Algoritmo que analiza estructura de URLs, detecta typosquatting, busca palabras clave sospechosas, 
              verifica dominios conocidos y evalua patrones de phishing en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use - Step by Step */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-yellow-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-yellow-500/30 to-orange-500/20 rounded-xl border border-yellow-400/30">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Como usar la aplicacion</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Sigue estos 4 pasos simples</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Step 1 */}
          <div className="relative group">
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 h-full hover:border-yellow-500/40 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-yellow-500/30">
                  1
                </div>
                <UserCheck className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Iniciar Sesion</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Accede con tu cuenta de correo electronico y contrasena para comenzar.
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500/50 z-10" />
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 h-full hover:border-yellow-500/40 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-yellow-500/30">
                  2
                </div>
                <ClipboardPaste className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Pegar URL</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Copia el enlace sospechoso y pegalo en la barra de analisis del panel.
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500/50 z-10" />
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 h-full hover:border-yellow-500/40 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-yellow-500/30">
                  3
                </div>
                <MousePointer className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Analizar</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Haz clic en &quot;Analizar URL&quot; y espera el escaneo de seguridad.
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500/50 z-10" />
          </div>

          {/* Step 4 */}
          <div className="group">
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 h-full hover:border-yellow-500/40 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-yellow-500/30">
                  4
                </div>
                <FileCheck className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Ver Resultado</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Revisa el veredicto de riesgo, score y las recomendaciones de seguridad.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How Detection Works */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500/30 to-teal-500/20 rounded-xl border border-cyan-400/30">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Como funciona el escaneo?</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Patrones y tecnicas de deteccion</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Pattern 1 */}
          <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-white text-sm">Estructura de URL</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Detectamos subdominios excesivos, longitud anormal, uso de IPs directas y caracteres unicode sospechosos.
            </p>
          </div>

          {/* Pattern 2 */}
          <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-white text-sm">Typosquatting</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Identificamos dominios que imitan marcas como Google, Facebook, Amazon, PayPal, Microsoft, etc.
            </p>
          </div>

          {/* Pattern 3 */}
          <div className="bg-black/30 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-white text-sm">Palabras Clave</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Buscamos terminos comunes en phishing: login, verify, secure, bank, password, urgent, etc.
            </p>
          </div>

          {/* Pattern 4 */}
          <div className="bg-black/30 rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white text-sm">Extensiones TLD</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Evaluamos dominios de alto riesgo como .xyz, .top, .club, .tk, .ml que son comunes en phishing.
            </p>
          </div>

          {/* Pattern 5 */}
          <div className="bg-black/30 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-white text-sm">Dominios Seguros</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Comparamos contra una lista de +30 dominios verificados y confiables para identificar sitios legitimos.
            </p>
          </div>

          {/* Pattern 6 */}
          <div className="bg-black/30 rounded-xl p-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-white text-sm">Score de Riesgo</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Calculamos un score de 0-100% basado en multiples factores para determinar el nivel de amenaza.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Levels */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Niveles de Riesgo</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span className="font-semibold text-emerald-400 text-xs sm:text-sm">Seguro / Bajo</span>
            </div>
            <p className="text-gray-400 text-[10px] sm:text-sm">
              Score 80-100%. Enlace seguro.
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-400 text-xs sm:text-sm">Medio</span>
            </div>
            <p className="text-gray-400 text-[10px] sm:text-sm">
              Score 50-79%. Precaucion.
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <span className="font-semibold text-orange-400 text-xs sm:text-sm">Alto</span>
            </div>
            <p className="text-gray-400 text-[10px] sm:text-sm">
              Score 20-49%. No ingresar datos.
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Ban className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="font-semibold text-red-400 text-xs sm:text-sm">Critico</span>
            </div>
            <p className="text-gray-400 text-[10px] sm:text-sm">
              Score 0-19%. NO visitar.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 sm:py-4">
        <p className="text-gray-500 text-xs sm:text-sm">
          PhishingSecureJD Enterprise - Protegiendo tu navegacion desde 2024
        </p>
      </div>
    </div>
  );
}
