import { Lightbulb, Shield, Lock, Eye } from 'lucide-react';

export function SecurityTips() {
  const tips = [
    {
      icon: Shield,
      title: 'Verifica el HTTPS',
      description: 'Siempre busca el candado en la barra de direcciones antes de ingresar datos sensibles.',
      color: 'cyan'
    },
    {
      icon: Lock,
      title: 'Usa 2FA',
      description: 'Activa la autenticación de dos factores en todas tus cuentas importantes.',
      color: 'emerald'
    },
    {
      icon: Eye,
      title: 'Revisa el dominio',
      description: 'Los sitios de phishing suelen usar dominios similares al original pero con pequeñas variaciones.',
      color: 'yellow'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
        <h3 className="text-base sm:text-lg font-bold text-white">Tips de Seguridad</h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="p-3 sm:p-4 bg-black/20 border border-gray-800 rounded-lg sm:rounded-xl hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex gap-2 sm:gap-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tip.color === 'cyan'
                      ? 'bg-cyan-500/20'
                      : tip.color === 'emerald'
                      ? 'bg-emerald-500/20'
                      : 'bg-yellow-500/20'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      tip.color === 'cyan'
                        ? 'text-cyan-400'
                        : tip.color === 'emerald'
                        ? 'text-emerald-400'
                        : 'text-yellow-400'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 group-hover:text-cyan-300 transition-colors">
                    {tip.title}
                  </h4>
                  <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-800">
        <button className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs sm:text-sm font-medium transition-all duration-300">
          Ver mas consejos
        </button>
      </div>
    </div>
  );
}
