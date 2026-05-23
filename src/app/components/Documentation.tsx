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
  ArrowRight
} from 'lucide-react';

export function Documentation() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="p-4 bg-cyan-500/20 rounded-xl">
              <Shield className="w-10 h-10 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Bienvenido a PhishingSecureJD
              </h2>
              <p className="text-gray-400 text-base sm:text-lg">
                Tu plataforma de seguridad para detectar amenazas de phishing en tiempo real
              </p>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed max-w-3xl">
            PhishingSecureJD es una plataforma avanzada de entrenamiento y seguridad disenada para 
            analizar enlaces en tiempo real y detectar posibles ataques de Phishing. Nuestra 
            tecnologia utiliza algoritmos de deteccion sofisticados para protegerte de amenazas en linea.
          </p>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What does it do? */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Search className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Que hace la pagina?</h3>
          </div>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              PhishingSecureJD es una herramienta de ciberseguridad que te permite:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Analizar URLs sospechosas antes de visitarlas</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Detectar patrones comunes de phishing automaticamente</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Bloquear enlaces maliciosos identificados</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Mantener un historial de todos tus analisis</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Exportar reportes en PDF de amenazas detectadas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* What APIs does it use? */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Cloud className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Que APIs utiliza?</h3>
          </div>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              La plataforma se integra con tecnologias de vanguardia:
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-black/30 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">Supabase</span>
                </div>
                <p className="text-sm text-gray-400">
                  Backend as a Service para autenticacion segura, persistencia de datos 
                  distribuidos en la nube y sincronizacion en tiempo real.
                </p>
              </div>
              <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span className="font-semibold text-white">Motor de Deteccion Local</span>
                </div>
                <p className="text-sm text-gray-400">
                  Algoritmo propietario que analiza patrones de URLs, detecta typosquatting, 
                  evalua certificados SSL y verifica reputacion de dominios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to use it - Step by Step */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <FileText className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Como usar PhishingSecureJD</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-bold">
                  1
                </span>
                <span className="font-semibold text-white">Iniciar Sesion</span>
              </div>
              <p className="text-sm text-gray-400">
                Accede con tu cuenta de correo electronico para comenzar a usar la plataforma.
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-500/50 z-10" />
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-bold">
                  2
                </span>
                <span className="font-semibold text-white">Pegar URL</span>
              </div>
              <p className="text-sm text-gray-400">
                Copia el enlace sospechoso y pegalo en la barra de analisis del panel principal.
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-500/50 z-10" />
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-bold">
                  3
                </span>
                <span className="font-semibold text-white">Analizar</span>
              </div>
              <p className="text-sm text-gray-400">
                Haz clic en el boton Analizar URL y espera unos segundos mientras se procesa.
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-500/50 z-10" />
          </div>

          {/* Step 4 */}
          <div>
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-bold">
                  4
                </span>
                <span className="font-semibold text-white">Revisar Resultado</span>
              </div>
              <p className="text-sm text-gray-400">
                Revisa el veredicto de riesgo y las recomendaciones de seguridad proporcionadas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works - Technical */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Como funciona el sistema de deteccion?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Detection Method 1 */}
          <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-white">Analisis de Estructura</span>
            </div>
            <p className="text-sm text-gray-400">
              Evaluamos la estructura de las URLs buscando subdominios excesivos, 
              longitud anormal y caracteres sospechosos.
            </p>
          </div>

          {/* Detection Method 2 */}
          <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-white">Deteccion de Typosquatting</span>
            </div>
            <p className="text-sm text-gray-400">
              Identificamos dominios que intentan imitar marcas conocidas como Google, 
              Facebook, Amazon, PayPal, etc.
            </p>
          </div>

          {/* Detection Method 3 */}
          <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-white">Palabras Clave</span>
            </div>
            <p className="text-sm text-gray-400">
              Detectamos palabras comunes en ataques de phishing como login, verify, 
              secure, bank, password, urgent, etc.
            </p>
          </div>

          {/* Detection Method 4 */}
          <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white">Verificacion SSL</span>
            </div>
            <p className="text-sm text-gray-400">
              Analizamos certificados de seguridad y validamos la autenticidad 
              del protocolo HTTPS utilizado.
            </p>
          </div>

          {/* Detection Method 5 */}
          <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-white">Dominios Conocidos</span>
            </div>
            <p className="text-sm text-gray-400">
              Comparamos contra una base de datos de dominios seguros y verificados 
              para identificar sitios legitimos.
            </p>
          </div>

          {/* Detection Method 6 */}
          <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Ban className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-white">Bloqueo de Amenazas</span>
            </div>
            <p className="text-sm text-gray-400">
              Los enlaces identificados como maliciosos pueden ser bloqueados 
              y agregados a tu lista personal de amenazas.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Levels */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-white mb-4">Niveles de Riesgo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">Seguro / Bajo</span>
            </div>
            <p className="text-sm text-gray-400">
              Score 80-100%. El enlace parece seguro para navegar.
            </p>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-400">Medio</span>
            </div>
            <p className="text-sm text-gray-400">
              Score 50-79%. Procede con precaucion, verifica el sitio.
            </p>
          </div>
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span className="font-semibold text-orange-400">Alto</span>
            </div>
            <p className="text-sm text-gray-400">
              Score 20-49%. Alta probabilidad de ser phishing. No ingresar datos.
            </p>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Ban className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-red-400">Critico</span>
            </div>
            <p className="text-sm text-gray-400">
              Score 0-19%. Enlace definitivamente malicioso. NO visitar.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">
          PhishingSecureJD Enterprise - Protegiendo tu navegacion desde 2024
        </p>
      </div>
    </div>
  );
}
