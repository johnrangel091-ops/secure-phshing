import { ExternalLink, Eye, Ban } from 'lucide-react';

interface AnalysisResult {
  id: number;
  url: string;
  date: string;
  risk: string;
  score: number;
  color: string;
}

interface LinkHistoryProps {
  history: AnalysisResult[];
  onBlock: (id: number) => void;
}

export function LinkHistory({ history, onBlock }: LinkHistoryProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-cyan-400" />
          Historial de Análisis Recientes
        </h2>
        <p className="text-gray-400 text-sm mt-1">Últimas URLs escaneadas por el sistema</p>
      </div>

      {/* Table or Empty State */}
      {history.length === 0 ? (
        <div className="p-20 text-center">
          <ExternalLink className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay análisis recientes</h3>
          <p className="text-gray-600">Los enlaces que analices aparecerán aquí</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">URL Analizada</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Fecha & Hora</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Nivel de Riesgo</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Score</th>
                  <th className="text-center px-6 py-4 text-gray-400 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-800/50 hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                        <span className="text-white font-medium group-hover:text-cyan-300 transition-colors truncate max-w-xs">
                          {item.url}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{item.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          item.color === 'emerald'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.color === 'yellow'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {item.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.color === 'emerald'
                                ? 'bg-emerald-500'
                                : item.color === 'yellow'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm font-semibold w-8">{item.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm font-medium transition-all duration-300">
                          <Eye className="w-4 h-4" />
                          Detalles
                        </button>
                        <button
                          onClick={() => onBlock(item.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-all duration-300"
                        >
                          <Ban className="w-4 h-4" />
                          Bloquear
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-800 flex items-center justify-between">
            <p className="text-gray-500 text-sm">Mostrando {history.length} registro{history.length !== 1 ? 's' : ''}</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white text-sm transition-all duration-300">
                Anterior
              </button>
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm transition-all duration-300">
                1
              </button>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white text-sm transition-all duration-300">
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
