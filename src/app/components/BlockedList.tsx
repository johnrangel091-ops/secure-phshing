import { Ban, Unlock } from 'lucide-react';

interface AnalysisResult {
  id: number;
  url: string;
  date: string;
  risk: string;
  score: number;
  color: string;
}

interface BlockedListProps {
  blockedList: AnalysisResult[];
  onUnblock: (id: number) => void;
}

export function BlockedList({ blockedList, onUnblock }: BlockedListProps) {
  return (
    <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 border border-red-500/30 rounded-2xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-red-500/30 bg-red-950/20">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Ban className="w-5 h-5 text-red-400" />
          Zona de Bloqueo Automático
        </h2>
        <p className="text-red-300/70 text-sm mt-1">URLs marcadas como amenazas bloqueadas</p>
      </div>

      {/* Content */}
      {blockedList.length === 0 ? (
        <div className="p-16 text-center">
          <Ban className="w-12 h-12 text-red-700 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-400/70 mb-1">No hay URLs bloqueadas</h3>
          <p className="text-red-500/50 text-sm">Las URLs bloqueadas aparecerán aquí</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="space-y-3">
            {blockedList.map((item) => (
              <div
                key={item.id}
                className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 hover:bg-red-950/40 hover:border-red-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Ban className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate group-hover:text-red-200 transition-colors">
                        {item.url}
                      </p>
                      <p className="text-red-400/60 text-xs mt-1">
                        Bloqueado el {item.date} • Riesgo: {item.risk} ({item.score}%)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onUnblock(item.id)}
                    className="ml-4 inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium transition-all duration-300 flex-shrink-0"
                  >
                    <Unlock className="w-4 h-4" />
                    Desbloquear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {blockedList.length > 0 && (
        <div className="p-4 border-t border-red-500/30 bg-red-950/10">
          <p className="text-red-400/70 text-sm text-center">
            {blockedList.length} URL{blockedList.length !== 1 ? 's' : ''} bloqueada{blockedList.length !== 1 ? 's' : ''} • Protección activa
          </p>
        </div>
      )}
    </div>
  );
}
