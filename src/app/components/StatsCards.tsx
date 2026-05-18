import { Shield, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StatsCards() {
  const [stats, setStats] = useState({ total: 0, blocked: 0 });

  useEffect(() => {
    const updateStats = () => {
      const history = JSON.parse(localStorage.getItem('phishguard_history') || '[]');
      const blocked = JSON.parse(localStorage.getItem('phishguard_blocked') || '[]');
      setStats({
        total: history.length,
        blocked: blocked.length
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Links Analyzed */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/60 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Links Analizados</h3>
          <p className="text-3xl font-bold text-white mb-2">{stats.total}</p>
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(stats.total * 10, 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Threats Blocked */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-red-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/60 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-red-400 text-sm font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Amenazas Bloqueadas</h3>
          <p className="text-3xl font-bold text-white mb-2">{stats.blocked}</p>
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-500" style={{ width: `${Math.min(stats.blocked * 15, 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Security Score */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/60 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Puntuación de Seguridad</h3>
          <div className="flex items-end gap-3">
            {/* Semi-circle Progress */}
            <div className="relative w-24 h-12 overflow-hidden">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                {/* Background Arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Progress Arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="125.6"
                  strokeDashoffset="18.84"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-end justify-center pb-1">
                <span className="text-2xl font-bold text-white">85</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-emerald-400 text-sm font-semibold">Excelente</p>
              <p className="text-gray-500 text-xs">Por encima del promedio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
