import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../../lib/supabase/auth-context';

interface AccountProfileProps {
  isFromRecovery?: boolean;
}

export function AccountProfile({ isFromRecovery = false }: AccountProfileProps) {
  const { user, updatePassword, signOut } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    isFromRecovery
      ? { type: 'error', text: 'Has accedido con un enlace de recuperacion. Por favor actualiza tu contrasena ahora.' }
      : null
  );

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
        console.error('[PhishingSecureJD] AccountProfile updatePassword error:', error);
        setMessage({
          type: 'error',
          text: error.message.includes('expired')
            ? 'El enlace de recuperacion ha expirado. Solicita uno nuevo desde la pantalla de inicio de sesion.'
            : error.message || 'Error al actualizar la contrasena. Intenta nuevamente.',
        });
      } else {
        setMessage({
          type: 'success',
          text: isFromRecovery
            ? '¡Contrasena actualizada con exito! Cerrando sesion para que inicies con tu nueva clave...'
            : '¡Contrasena actualizada correctamente!',
        });
        setPassword('');
        setConfirmPassword('');
        if (isFromRecovery) {
          setTimeout(() => signOut(), 2500);
        }
      }
    } catch (err) {
      console.error('[PhishingSecureJD] AccountProfile unexpected error:', err);
      setMessage({ type: 'error', text: 'Ocurrio un error inesperado. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {isFromRecovery && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl">
          <KeyRound className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-sm">Restablecimiento de contrasena activo</p>
            <p className="text-amber-400/80 text-xs mt-0.5">
              Ingresaste con un enlace de recuperacion. Actualiza tu contrasena a continuacion para continuar usando la app.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Perfil de Usuario</h2>
            <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Cuenta verificada
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Correo electronico</span>
            </div>
            <p className="text-white font-medium text-sm break-all">{user?.email || '—'}</p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Proveedor</span>
            </div>
            <p className="text-white font-medium text-sm capitalize">
              {user?.app_metadata?.provider || 'email'}
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Miembro desde</span>
            </div>
            <p className="text-white font-medium text-sm">{memberSince}</p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Ultimo acceso</span>
            </div>
            <p className="text-white font-medium text-sm">{lastSignIn}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Cambiar Contrasena</h3>
            <p className="text-gray-400 text-sm">Elige una contrasena segura de al menos 8 caracteres</p>
          </div>
        </div>

        {message && (
          <div className={`mb-5 p-4 rounded-xl flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            {message.type === 'success'
              ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
            <p className={`text-sm ${message.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Nueva Contrasena
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimo 8 caracteres"
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
              <p className="mt-1.5 text-xs text-red-400">Minimo 8 caracteres</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Confirmar Nueva Contrasena
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu nueva contrasena"
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
              <p className="mt-1.5 text-xs text-red-400">Las contrasenas no coinciden</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || message?.type === 'success'}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            style={{
              boxShadow: canSubmit ? '0 0 30px rgba(6, 182, 212, 0.4)' : 'none',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Actualizar Contrasena
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
