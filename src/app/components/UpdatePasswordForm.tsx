import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../lib/supabase/auth-context';

export function UpdatePasswordForm() {
  const { updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const passwordValid = password.length >= 8;
  const confirmValid = confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = passwordValid && confirmValid && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await updatePassword(password);
      if (error) {
        console.error('[PhishingSecureJD] updatePassword error:', error);
        setMessage({
          type: 'error',
          text: error.message.includes('expired')
            ? 'El enlace de recuperacion ha expirado. Solicita uno nuevo.'
            : error.message || 'Error al actualizar la contraseña. Intenta nuevamente.',
        });
      } else {
        setMessage({
          type: 'success',
          text: '¡Contraseña actualizada con exito! Redirigiendo al inicio de sesion...',
        });
        setTimeout(() => signOut(), 2500);
      }
    } catch (err) {
      console.error('[PhishingSecureJD] UpdatePasswordForm unexpected error:', err);
      setMessage({ type: 'error', text: 'Ocurrio un error inesperado. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <Logo className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Nueva Contraseña</h1>
          <p className="text-gray-400 text-sm sm:text-base">Elige una contraseña segura para tu cuenta</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
          {message && (
            <div className={`mb-6 p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <p className={`text-sm flex items-center gap-2 ${
                message.type === 'success' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {message.type === 'success'
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 flex-shrink-0" />}
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  disabled={isLoading || message?.type === 'success'}
                  className={`w-full pl-12 pr-12 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 disabled:opacity-50 ${
                    password.length === 0
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
              {password.length > 0 && !passwordValid && (
                <p className="mt-1.5 text-xs text-red-400">Mínimo 8 caracteres</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  disabled={isLoading || message?.type === 'success'}
                  className={`w-full pl-12 pr-12 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 disabled:opacity-50 ${
                    confirmPassword.length === 0
                      ? 'border-gray-700 focus:border-cyan-500'
                      : confirmValid
                      ? 'border-emerald-500 focus:border-emerald-400'
                      : 'border-red-500 focus:border-red-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !confirmValid && (
                <p className="mt-1.5 text-xs text-red-400">Las contraseñas no coinciden</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || message?.type === 'success'}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                boxShadow: canSubmit ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Guardar nueva contraseña'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
          2026 PhishingSecureJD. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
