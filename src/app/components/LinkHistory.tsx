import { useState } from 'react';
import {
  ExternalLink,
  Eye,
  Ban,
  X,
  Shield,
  Calendar,
  Lock,
  Unlock,
  FileDown,
} from 'lucide-react';
import {
  generateExecutivePdfReport,
  getDynamicAccessStatus,
} from '../../lib/analysis';

type EstadoAcceso = 'Pendiente' | 'Seguro' | 'Sospechoso';

interface AnalysisResult {
  id: number;
  url: string;
  date: string;
  estado: EstadoAcceso;
  bloqueado: boolean;
  risk: string;
  score: number;
  color: string;
}

interface LinkHistoryProps {
  history: AnalysisResult[];
  onBlock: (id: number) => void;
  isLoading?: boolean;
}

function estadoBadgeClasses(estado: EstadoAcceso): string {
  switch (estado) {
    case 'Seguro':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'Sospechoso':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
}

function accesoLabel(item: AnalysisResult): { text: string; classes: string } {
  const access = getDynamicAccessStatus(item);
  return {
    text: access.shortText,
    classes: access.badgeClasses,
  };
}

export function LinkHistory({ history, onBlock, isLoading = false }: LinkHistoryProps) {
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null);

  const handleExportPDF = async (item: AnalysisResult) => {
    try {
      await generateExecutivePdfReport({
        id: item.id,
        url: item.url,
        date: item.date,
        estado: item.estado,
        risk: item.risk,
        score: item.score,
        bloqueado: item.bloqueado,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-xl shadow-black/20">
        <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-cyan-400 shrink-0" />
            Historial de Analisis
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Enlaces analizados — sincronizado con Supabase
          </p>
        </div>

        {isLoading ? (
          <div className="px-4 py-16 sm:py-20 text-center">
            <ExternalLink className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-slate-300">Cargando historial...</h3>
            <p className="text-slate-500 text-sm mt-1">Obteniendo registros de la base de datos</p>
          </div>
        ) : history.length === 0 ? (
          <div className="px-4 py-16 sm:py-20 text-center">
            <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400">Sin analisis recientes</h3>
            <p className="text-slate-600 text-sm mt-1">
              Los enlaces que analices apareceran aqui al instante
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: tarjetas apiladas */}
            <div className="md:hidden p-3 space-y-3">
              {history.map((item) => {
                const acceso = accesoLabel(item);
                const accessStatus = getDynamicAccessStatus(item);
                return (
                  <article
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-slate-100 truncate flex-1" title={item.url}>
                        {item.url}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.date}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${estadoBadgeClasses(item.estado)}`}
                      >
                        {item.estado}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${acceso.classes}`}
                      >
                        {accessStatus.permitted ? (
                          <Unlock className="w-3 h-3" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                        {acceso.text}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportPDF(item)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-colors"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => onBlock(item.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium border border-red-500/40 bg-red-950/40 text-red-400 hover:bg-red-950/70 transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Bloquear
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Desktop: tabla corporativa */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Enlace
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Acceso
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {history.map((item) => {
                    const acceso = accesoLabel(item);
                const accessStatus = getDynamicAccessStatus(item);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <ExternalLink className="w-4 h-4 text-slate-500 shrink-0" />
                            <span className="text-sm text-slate-100 truncate" title={item.url}>
                              {item.url}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${estadoBadgeClasses(item.estado)}`}
                          >
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${acceso.classes}`}
                          >
                            {accessStatus.permitted ? (
                              <Unlock className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                            {acceso.text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Detalles
                            </button>
                            <button
                              type="button"
                              onClick={() => handleExportPDF(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
                            >
                              <FileDown className="w-4 h-4" />
                              PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => onBlock(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-500/40 text-red-400 hover:bg-red-950/50 transition-colors"
                            >
                              <Ban className="w-4 h-4" />
                              Bloquear
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-800 bg-slate-900/50 px-4 py-3 sm:px-6">
              <p className="text-slate-500 text-sm text-center sm:text-left">
                {history.length} registro{history.length !== 1 ? 's' : ''} en historial
              </p>
            </div>
          </>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
            aria-hidden
          />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-4 pr-8">Detalles del analisis</h3>

            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <p className="text-slate-500 text-xs uppercase mb-1">URL</p>
                <p className="text-slate-100 break-all">{selectedItem.url}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <p className="text-slate-500 text-xs uppercase mb-1">Fecha</p>
                <p className="text-slate-100">{selectedItem.date}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${estadoBadgeClasses(selectedItem.estado)}`}
                >
                  {selectedItem.estado}
                </span>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${accesoLabel(selectedItem).classes}`}
                >
                  {accesoLabel(selectedItem).text}
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                Nivel interno: {selectedItem.risk} · Score {selectedItem.score}%
              </p>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 font-medium"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  onBlock(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium flex items-center justify-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Bloquear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
