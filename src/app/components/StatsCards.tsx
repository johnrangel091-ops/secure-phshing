import { Shield, AlertTriangle, TrendingUp, Activity, CheckCircle, Target } from 'lucide-react';
import { useMemo } from 'react';

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

interface StatsCardsProps {
  history: AnalysisResult[];
  blockedList: AnalysisResult[];
}

export function StatsCards({ history, blockedList }: StatsCardsProps) {
  // Calcular estadisticas directamente desde los props (datos de Supabase)
  const stats = useMemo(() => {
    // Combinar historial y bloqueados para estadisticas globales
    const allAnalyzed = [...history, ...blockedList];
    const total = allAnalyzed.length;
    
    const threats = allAnalyzed.filter(
      (item) =>
        item.estado === 'Sospechoso' ||
        item.risk === 'Alto' ||
        item.risk === 'Critico' ||
        item.risk === 'Medio'
    ).length;

    const safe = allAnalyzed.filter(
      (item) => item.estado === 'Seguro' || item.risk === 'Bajo' || item.risk === 'Seguro'
    ).length;
    
    // Calcular efectividad: porcentaje de deteccion correcta
    // Efectividad = (amenazas detectadas + seguros verificados) / total * 100
    const effectiveness = total > 0 ? Math.round(((threats + safe) / total) * 100) : 0;
    
    return { total, threats, safe, effectiveness };
  }, [history, blockedList]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {/* Total de Enlaces Analizados */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/60 transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-xs sm:text-sm font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
              Global
            </span>
          </div>
          <h3 className="text-gray-400 text-xs sm:text-sm mb-1 truncate">Total Analizados</h3>
          <p className="text-xl sm:text-3xl font-bold text-white mb-2">{stats.total}</p>
          <div className="w-full bg-gray-800 rounded-full h-1 sm:h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500" 
              style={{ width: `${Math.min(stats.total * 5, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-2 hidden sm:block">Contador global de analisis</p>
        </div>
      </div>

      {/* Amenazas Detectadas */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-red-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/60 transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center relative">
              <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
              {stats.threats > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <span className="text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
              Peligro
            </span>
          </div>
          <h3 className="text-gray-400 text-xs sm:text-sm mb-1 truncate">Amenazas</h3>
          <p className="text-xl sm:text-3xl font-bold text-red-400 mb-2">{stats.threats}</p>
          <div className="w-full bg-gray-800 rounded-full h-1 sm:h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-500" 
              style={{ width: `${stats.total > 0 ? (stats.threats / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-2 hidden sm:block">URLs de alto riesgo/phishing</p>
        </div>
      </div>

      {/* Enlaces Seguros */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/60 transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-1">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
              Seguro
            </span>
          </div>
          <h3 className="text-gray-400 text-xs sm:text-sm mb-1 truncate">Seguros</h3>
          <p className="text-xl sm:text-3xl font-bold text-emerald-400 mb-2">{stats.safe}</p>
          <div className="w-full bg-gray-800 rounded-full h-1 sm:h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-green-400 h-full transition-all duration-500" 
              style={{ width: `${stats.total > 0 ? (stats.safe / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-2 hidden sm:block">URLs verificadas como limpias</p>
        </div>
      </div>

      {/* Efectividad de Deteccion */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-purple-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/60 transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Target className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <span className={`text-xs sm:text-sm font-semibold flex items-center gap-1 ${
              stats.effectiveness >= 80 ? 'text-emerald-400' : 
              stats.effectiveness >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {stats.effectiveness >= 80 ? 'OK' : 
               stats.effectiveness >= 50 ? 'Med' : 'Bajo'}
            </span>
          </div>
          <h3 className="text-gray-400 text-xs sm:text-sm mb-1 truncate">Efectividad</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <p className="text-xl sm:text-3xl font-bold text-white">{stats.effectiveness}</p>
            <span className="text-sm sm:text-lg text-purple-400">%</span>
          </div>
          {/* Barra de progreso con gradiente */}
          <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3 overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-700 rounded-full ${
                stats.effectiveness >= 80 
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400' 
                  : stats.effectiveness >= 50 
                  ? 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-400'
                  : 'bg-gradient-to-r from-red-600 via-red-500 to-orange-400'
              }`}
              style={{ width: `${stats.effectiveness}%` }}
            ></div>
            {/* Marcadores de progreso - solo en desktop */}
            <div className="absolute inset-0 hidden sm:flex items-center justify-between px-1">
              <div className="w-0.5 h-1.5 bg-gray-600/50 rounded"></div>
              <div className="w-0.5 h-1.5 bg-gray-600/50 rounded"></div>
              <div className="w-0.5 h-1.5 bg-gray-600/50 rounded"></div>
              <div className="w-0.5 h-1.5 bg-gray-600/50 rounded"></div>
            </div>
          </div>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-2 hidden sm:block">Precision del sistema de analisis</p>
        </div>
      </div>
    </div>
  );
}
