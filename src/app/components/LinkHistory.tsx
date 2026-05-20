import { useState } from 'react';
import { ExternalLink, Eye, Ban, X, Shield, Calendar, AlertTriangle, Server, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';

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
  isLoading?: boolean;
}

export function LinkHistory({ history, onBlock, isLoading = false }: LinkHistoryProps) {
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null);

  const handleOpenDetails = (item: AnalysisResult) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const handleExportPDF = (item: AnalysisResult) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(6, 182, 212);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('PhishingSecureJD', 20, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Reporte de Analisis de Seguridad', 20, 35);
      
      // Body content
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);
      
      let yPos = 60;
      
      // Date and Time
      doc.setFont('helvetica', 'bold');
      doc.text('Fecha y Hora del Analisis:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(item.date, 85, yPos);
      yPos += 15;
      
      // URL Analyzed
      doc.setFont('helvetica', 'bold');
      doc.text('URL Analizada:', 20, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      // Handle long URLs by splitting
      const urlLines = doc.splitTextToSize(item.url, 170);
      doc.text(urlLines, 20, yPos);
      yPos += (urlLines.length * 6) + 15;
      
      doc.setFontSize(12);
      
      // Risk Level
      doc.setFont('helvetica', 'bold');
      doc.text('Nivel de Riesgo:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      
      // Color based on risk
      if (item.color === 'emerald') {
        doc.setTextColor(16, 185, 129);
      } else if (item.color === 'yellow') {
        doc.setTextColor(245, 158, 11);
      } else {
        doc.setTextColor(239, 68, 68);
      }
      doc.text(item.risk, 70, yPos);
      doc.setTextColor(50, 50, 50);
      yPos += 15;
      
      // Security Score
      doc.setFont('helvetica', 'bold');
      doc.text('Score de Seguridad:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.score}%`, 78, yPos);
      yPos += 20;
      
      // Score bar
      doc.setFillColor(229, 231, 235);
      doc.rect(20, yPos, 100, 8, 'F');
      
      if (item.color === 'emerald') {
        doc.setFillColor(16, 185, 129);
      } else if (item.color === 'yellow') {
        doc.setFillColor(245, 158, 11);
      } else {
        doc.setFillColor(239, 68, 68);
      }
      doc.rect(20, yPos, item.score, 8, 'F');
      yPos += 25;
      
      // Recommendations based on risk
      doc.setFont('helvetica', 'bold');
      doc.text('Recomendaciones:', 20, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      if (item.color === 'emerald') {
        doc.text('- Este sitio parece seguro para navegar', 25, yPos);
        yPos += 7;
        doc.text('- Verifica siempre que la URL sea la oficial', 25, yPos);
      } else if (item.color === 'yellow') {
        doc.text('- Procede con precaucion al navegar', 25, yPos);
        yPos += 7;
        doc.text('- No ingreses datos personales sensibles', 25, yPos);
        yPos += 7;
        doc.text('- Verifica la autenticidad del sitio', 25, yPos);
      } else {
        doc.text('- NO navegues en este sitio', 25, yPos);
        yPos += 7;
        doc.text('- No ingreses ninguna informacion personal', 25, yPos);
        yPos += 7;
        doc.text('- Reporta este sitio como sospechoso', 25, yPos);
        yPos += 7;
        doc.text('- Considera bloquear esta URL', 25, yPos);
      }
      
      // Footer
      doc.setFillColor(30, 30, 30);
      doc.rect(0, 270, 210, 27, 'F');
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.text('Reporte generado automaticamente por PhishingSecureJD Enterprise', 20, 280);
      doc.text(`ID de Registro: ${item.id}`, 20, 286);
      doc.text(`Generado: ${new Date().toLocaleString()}`, 120, 286);
      
      // Save the PDF
      const filename = `PhishingSecureJD_Reporte_${item.id}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-cyan-400" />
            Historial de Análisis Recientes
          </h2>
          <p className="text-gray-400 text-sm mt-1">Últimas URLs escaneadas por el sistema</p>
        </div>

        {/* Table or Empty State or Loading State */}
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="relative">
              <ExternalLink className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 mx-auto border-2 border-cyan-400/50 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Cargando historial...</h3>
            <p className="text-gray-600">Sincronizando datos desde la nube</p>
          </div>
        ) : history.length === 0 ? (
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
                          <button 
                            onClick={() => handleOpenDetails(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm font-medium transition-all duration-300"
                          >
                            <Eye className="w-4 h-4" />
                            Detalles
                          </button>
                          <button
                            onClick={() => handleExportPDF(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium transition-all duration-300"
                            title="Exportar Reporte PDF"
                          >
                            <FileDown className="w-4 h-4" />
                            PDF
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

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseDetails}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-cyan-500/10 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={handleCloseDetails}
              className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl ${
                selectedItem.color === 'emerald' ? 'bg-emerald-500/20' :
                selectedItem.color === 'yellow' ? 'bg-yellow-500/20' :
                'bg-red-500/20'
              }`}>
                <Shield className={`w-6 h-6 ${
                  selectedItem.color === 'emerald' ? 'text-emerald-400' :
                  selectedItem.color === 'yellow' ? 'text-yellow-400' :
                  'text-red-400'
                }`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Detalles del Análisis</h3>
                <p className="text-gray-400 text-sm">Información completa de la URL</p>
              </div>
            </div>

            {/* URL */}
            <div className="mb-4 p-4 bg-black/30 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">URL Analizada</p>
              <p className="text-white font-medium break-all">{selectedItem.url}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Risk Level */}
              <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    selectedItem.color === 'emerald' ? 'text-emerald-400' :
                    selectedItem.color === 'yellow' ? 'text-yellow-400' :
                    'text-red-400'
                  }`} />
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Nivel de Riesgo</p>
                </div>
                <p className={`text-2xl font-bold ${
                  selectedItem.color === 'emerald' ? 'text-emerald-400' :
                  selectedItem.color === 'yellow' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{selectedItem.risk}</p>
              </div>

              {/* Score */}
              <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Score</p>
                </div>
                <p className="text-2xl font-bold text-cyan-400">{selectedItem.score}%</p>
              </div>

              {/* Date */}
              <div className="p-4 bg-black/30 rounded-xl border border-gray-700 col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Fecha de Análisis</p>
                </div>
                <p className="text-lg font-semibold text-white">{selectedItem.date}</p>
              </div>

              {/* ID (simulating IP) */}
              <div className="p-4 bg-black/30 rounded-xl border border-gray-700 col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <p className="text-gray-400 text-xs uppercase tracking-wide">ID de Registro</p>
                </div>
                <p className="text-lg font-mono text-white">{selectedItem.id}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseDetails}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold transition-all duration-300"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onBlock(selectedItem.id);
                  handleCloseDetails();
                }}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Bloquear URL
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}
