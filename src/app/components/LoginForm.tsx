import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../lib/supabase/auth-context';

export function LoginForm() {
  const { signInWithPassword, signUp, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(value.length > 0 ? isValid : null);
    setEmail(value);
    setError(null);
  };

  const validatePassword = (value: string) => {
    const isValid = value.length >= 8;
    setPasswordValid(value.length > 0 ? isValid : null);
    setPassword(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || !passwordValid) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const { error } = await signInWithPassword(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Credenciales incorrectas. Verifica tu email y contrasena.');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Tu email no ha sido confirmado. Revisa tu bandeja de entrada.');
          } else {
            setError(error.message);
          }
        }
      } else {
        const { error, needsConfirmation } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            setError('Este email ya esta registrado. Intenta iniciar sesion.');
          } else {
            setError(error.message);
          }
        } else if (needsConfirmation) {
          setSuccessMessage('Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.');
          setEmail('');
          setPassword('');
          setEmailValid(null);
          setPasswordValid(null);
        }
      }
    } catch (err) {
      setError('Ocurrio un error inesperado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError('Error al iniciar sesion con Google. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al conectar con Google.');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión - PhishingSecureJD</h1>
          <p className="text-gray-400">Plataforma de Entrenamiento en Seguridad contra Phishing</p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(null); setSuccessMessage(null); }}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Iniciar Sesion
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); setSuccessMessage(null); }}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Registro
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <p className="text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Correo Electronico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  placeholder="ejemplo@empresa.com"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 disabled:opacity-50 ${
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
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  placeholder="Minimo 8 caracteres"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 disabled:opacity-50 ${
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
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-2 text-xs text-gray-500">
                  Usa al menos 8 caracteres con mayusculas, numeros y simbolos
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
                  Olvidaste tu contrasena?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!emailValid || !passwordValid || isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                boxShadow: emailValid && passwordValid && !isLoading ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none'
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isLogin ? 'Iniciando sesion...' : 'Creando cuenta...'}
                  </>
                ) : (
                  isLogin ? 'Acceder a la Plataforma' : 'Crear Cuenta'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* OAuth Options */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-500 text-sm mb-4">O continua con</p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="py-3 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl text-gray-300 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          2026 PhishingSecureJD. Todos los derechos reservados.
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
