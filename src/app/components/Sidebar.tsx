import { LayoutDashboard, History, Database, Settings, LogOut, Menu, X, BookOpen, UserCircle } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../lib/supabase/auth-context';
import { useState, useEffect } from 'react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeSection, onNavigate, onLogout }: SidebarProps) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'history', label: 'Historial de Análisis', icon: History },
    { id: 'threats', label: 'Base de Amenazas', icon: Database },
    { id: 'documentation', label: 'Documentación', icon: BookOpen },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'account', label: 'Mi Cuenta', icon: UserCircle },
  ];

  // Cerrar menu al cambiar de seccion
  const handleNavigate = (section: string) => {
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  // Cerrar menu al hacer resize a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-[#050505] to-[#0a0a0a] border-b border-cyan-500/20 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <div>
            <h2 className="font-bold text-white text-sm">PhishingSecureJD</h2>
            <p className="text-xs text-cyan-400">Enterprise</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop visible, Mobile slide-in */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-72 h-screen bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-r border-cyan-500/20 backdrop-blur-xl flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Logo Section */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Logo className="w-12 h-12" />
          <div>
            <h2 className="font-bold text-white">PhishingSecureJD</h2>
            <p className="text-xs text-cyan-400">Enterprise</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'} transition-colors`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="flex items-center gap-3 mb-3 p-3 bg-white/5 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="font-bold text-white text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.email || 'Usuario'}
            </p>
            <p className="text-gray-500 text-xs">Pro Plan</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Cerrar Sesion</span>
        </button>
      </div>
      </aside>
    </>
  );
}
