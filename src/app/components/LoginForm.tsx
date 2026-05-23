import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../lib/supabase/auth-context';
import { createClient } from '../../lib/supabase/client';

export function LoginForm() {
  const { signInWithPassword, signUp } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailValid, setResetEmailValid] = useState<boolean | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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

  const validateResetEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setResetEmailValid(value.length > 0 ? isValid : null);
    setResetEmail(value);
    setResetMessage(null);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmailValid) return;

    setIsResetting(true);
    setResetMessage(null);

    try {
      const supabase = createClient();
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/update-password`
        : 'http://localhost:3000/update-password';

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setResetMessage({ 
          type: 'error', 
          text: error.message || 'Error al enviar el enlace de recuperacion. Intenta nuevamente.' 
        });
      } else {
        setResetMessage({ 
          type: 'success', 
          text: 'Enlace de recuperacion enviado. Revisa tu bandeja de entrada y carpeta de spam.' 
        });
        setResetEmail('');
        setResetEmailValid(null);
      }
    } catch (err) {
      setResetMessage({ 
        type: 'error', 
        text: 'Ocurrio un error inesperado. Intenta nuevamente.' 
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <Logo className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Iniciar Sesion</h1>
          <p className="text-gray-400 text-sm sm:text-base">Plataforma de Entrenamiento en Seguridad</p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(null); setSuccessMessage(null); }}
              disabled={isLoading}
              className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
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
              className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
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
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl">
              <p className="text-red-400 text-xs sm:text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg sm:rounded-xl">
              <p className="text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetMessage(null);
                    setResetEmail('');
                    setResetEmailValid(null);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors hover:underline"
                >
                  Olvidaste tu contrasena?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!emailValid || !passwordValid || isLoading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                boxShadow: emailValid && passwordValid && !isLoading ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none'
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="text-sm sm:text-base">{isLogin ? 'Iniciando sesion...' : 'Creando cuenta...'}</span>
                  </>
                ) : (
                  isLogin ? 'Acceder a la Plataforma' : 'Crear Cuenta'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
          2026 PhishingSecureJD. Todos los derechos reservados.
        </p>
      </div>

      {/* Modal de Recuperacion de Contrasena */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowForgotPassword(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Recuperar Contrasena</h2>
              <p className="text-gray-400 text-sm">
                Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena.
              </p>
            </div>

            {/* Reset Messages */}
            {resetMessage && (
              <div className={`mb-6 p-4 rounded-xl ${
                resetMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border border-emerald-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <p className={`text-sm flex items-center gap-2 ${
                  resetMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {resetMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {resetMessage.text}
                </p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Correo Electronico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => validateResetEmail(e.target.value)}
                    placeholder="ejemplo@empresa.com"
                    disabled={isResetting}
                    className={`w-full pl-12 pr-12 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 disabled:opacity-50 ${
                      resetEmailValid === null
                        ? 'border-gray-700 focus:border-cyan-500'
                        : resetEmailValid
                        ? 'border-emerald-500 focus:border-emerald-400'
                        : 'border-red-500 focus:border-red-400'
                    }`}
                  />
                  {resetEmailValid !== null && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {resetEmailValid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!resetEmailValid || isResetting}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: resetEmailValid && !isResetting ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none'
                }}
              >
                {isResetting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  'Enviar enlace de recuperacion'
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl text-gray-300 font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesion
              </button>
            </form>
          </div>
        </div>
      )}

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
