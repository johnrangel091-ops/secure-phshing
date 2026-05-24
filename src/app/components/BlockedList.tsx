import { Ban, Unlock } from 'lucide-react';

interface AnalysisResult {
  id: number;
  url: string;
  date: string;
  estado: 'Pendiente' | 'Seguro' | 'Sospechoso';
  bloqueado: boolean;
  risk: string;
  score: number;
  color: string;
}

interface BlockedListProps {
  blockedList: AnalysisResult[];
  onUnblock: (id: number) => void | Promise<void>;
  unblockingId?: number | null;
}

function toHistorialId(id: number | string): number {
  return typeof id === 'string' ? parseInt(id, 10) : id;
}

export function BlockedList({ blockedList, onUnblock, unblockingId = null }: BlockedListProps) {
  return (
    <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 border border-red-500/30 rounded-2xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-red-500/30 bg-red-950/20">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Ban className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
          Zona de Bloqueo Automatico
        </h2>
        <p className="text-red-300/70 text-xs sm:text-sm mt-1">URLs marcadas como amenazas bloqueadas</p>
      </div>

      {/* Content */}
      {blockedList.length === 0 ? (
        <div className="p-8 sm:p-16 text-center">
          <Ban className="w-10 h-10 sm:w-12 sm:h-12 text-red-700 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-semibold text-red-400/70 mb-1">No hay URLs bloqueadas</h3>
          <p className="text-red-500/50 text-xs sm:text-sm">Las URLs bloqueadas apareceran aqui</p>
        </div>
      ) : (
        <div className="p-3 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {blockedList.map((item) => {
              const recordId = toHistorialId(item.id);
              const isUnblocking = unblockingId === recordId;

              return (
                <div
                  key={recordId}
                  className="bg-red-950/30 border border-red-500/30 rounded-xl p-3 sm:p-4 hover:bg-red-950/40 hover:border-red-500/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <Ban className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm sm:text-base font-medium truncate group-hover:text-red-200 transition-colors">
                          {item.url}
                        </p>
                        <p className="text-red-400/60 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                          Bloqueado el {item.date} — Estado: {item.estado}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isUnblocking}
                      onClick={() => onUnblock(recordId)}
                      className="self-end sm:self-auto inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs sm:text-sm font-medium transition-all duration-300 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Unlock className="w-3 h-3 sm:w-4 sm:h-4" />
                      {isUnblocking ? 'Desbloqueando...' : 'Desbloquear'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {blockedList.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-red-500/30 bg-red-950/10">
          <p className="text-red-400/70 text-xs sm:text-sm text-center">
            {blockedList.length} URL{blockedList.length !== 1 ? 's' : ''} bloqueada{blockedList.length !== 1 ? 's' : ''} - Proteccion activa
          </p>
        </div>
      )}
    </div>
  );
}
