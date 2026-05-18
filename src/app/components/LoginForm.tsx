import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Logo } from './Logo';

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(value.length > 0 ? isValid : null);
    setEmail(value);
  };

  const validatePassword = (value: string) => {
    const isValid = value.length >= 8;
    setPasswordValid(value.length > 0 ? isValid : null);
    setPassword(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValid && passwordValid) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Logo className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PhishingSecureJD</h1>
          <p className="text-gray-400">Plataforma de Seguridad Avanzada</p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Registro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  placeholder="ejemplo@empresa.com"
                  className={`w-full pl-12 pr-12 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 ${
                    emailValid === null
                      ? 'border-gray-700 focus:border-cyan-500'
                      : emailValid
                      ? 'border-emerald-500 focus:border-emerald-400'
                      : 'border-red-500 focus:border-red-400'
                  }`}
                />
                {emailValid !== null && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {emailValid ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full pl-12 pr-12 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 ${
                    passwordValid === null
                      ? 'border-gray-700 focus:border-cyan-500'
                      : passwordValid
                      ? 'border-emerald-500 focus:border-emerald-400'
                      : 'border-red-500 focus:border-red-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-2 text-xs text-gray-500">
                  Usa al menos 8 caracteres con mayúsculas, números y símbolos
                </p>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-400 cursor-pointer">
                  <input type="checkbox" className="mr-2 accent-cyan-500" />
                  Recordarme
                </label>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!emailValid || !passwordValid}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group animate-pulse-hover"
              style={{
                boxShadow: emailValid && passwordValid ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none'
              }}
            >
              <span className="relative z-10">
                {isLogin ? 'Acceder a la Plataforma' : 'Crear Cuenta'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* OAuth Options */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-500 text-sm mb-4">O continúa con</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl text-gray-300 text-sm font-medium transition-all duration-300">
                Google
              </button>
              <button className="py-3 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl text-gray-300 text-sm font-medium transition-all duration-300">
                Microsoft
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 PhishingSecureJD. Todos los derechos reservados.
        </p>
      </div>

      <style>{`
        @keyframes pulse-hover {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-hover:hover:not(:disabled) {
          animation: pulse-hover 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
