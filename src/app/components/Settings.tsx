import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Trash2, Shield, Save, Mail, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsProps {
  onClearHistory: () => void;
  onThemeChange: (isDark: boolean) => void;
}

export function Settings({ onClearHistory, onThemeChange }: SettingsProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [sensitivity, setSensitivity] = useState(2); // 1: Bajo, 2: Medio, 3: Alto
  const [notifications, setNotifications] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('phishguard_darkmode');
    const savedSensitivity = localStorage.getItem('phishguard_sensitivity');
    const savedNotifications = localStorage.getItem('phishguard_notifications');
    const savedAlertEmail = localStorage.getItem('phishguard_alert_email');
    const savedEmailAlertsEnabled = localStorage.getItem('phishguard_email_alerts_enabled');

    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true';
      setDarkMode(isDark);
      onThemeChange(isDark);
    }
    if (savedSensitivity !== null) {
      setSensitivity(parseInt(savedSensitivity));
    }
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === 'true');
    }
    if (savedAlertEmail !== null) {
      setAlertEmail(savedAlertEmail);
    }
    if (savedEmailAlertsEnabled !== null) {
      setEmailAlertsEnabled(savedEmailAlertsEnabled === 'true');
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('phishguard_darkmode', String(newValue));
    onThemeChange(newValue);
  };

  const handleSensitivityChange = (value: number) => {
    setSensitivity(value);
    localStorage.setItem('phishguard_sensitivity', String(value));
  };

  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('phishguard_notifications', String(newValue));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertEmail(e.target.value);
    setEmailSaved(false);
  };

  const handleSaveEmail = () => {
    localStorage.setItem('phishguard_alert_email', alertEmail);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 3000);
  };

  const handleEmailAlertsToggle = () => {
    const newValue = !emailAlertsEnabled;
    setEmailAlertsEnabled(newValue);
    localStorage.setItem('phishguard_email_alerts_enabled', String(newValue));
  };

  const handleClearHistory = () => {
    if (confirm('¿Estás seguro de que deseas borrar todo el historial? Esta acción no se puede deshacer.')) {
      onClearHistory();
    }
  };

  const getSensitivityLabel = () => {
    switch (sensitivity) {
      case 1: return 'Bajo';
      case 2: return 'Medio';
      case 3: return 'Alto';
      default: return 'Medio';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Appearance Section */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
            {darkMode ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-cyan-400" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Apariencia</h3>
            <p className="text-gray-400 text-sm">Personaliza el tema de la interfaz</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-xl">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            <div>
              <p className="text-white font-medium">Modo {darkMode ? 'Oscuro' : 'Claro'}</p>
              <p className="text-gray-500 text-sm">Cambia el tema visual</p>
            </div>
          </div>
          <button
            onClick={handleDarkModeToggle}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              darkMode ? 'bg-cyan-600' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                darkMode ? 'translate-x-7' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Detection Settings */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Detección</h3>
            <p className="text-gray-400 text-sm">Configura la sensibilidad del análisis</p>
          </div>
        </div>

        <div className="p-4 bg-black/20 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <label className="text-white font-medium">Nivel de Sensibilidad</label>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              sensitivity === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              sensitivity === 2 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {getSensitivityLabel()}
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="1"
              max="3"
              value={sensitivity}
              onChange={(e) => handleSensitivityChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right,
                  ${sensitivity === 1 ? '#eab308' : sensitivity === 2 ? '#06b6d4' : '#ef4444'} 0%,
                  ${sensitivity === 1 ? '#eab308' : sensitivity === 2 ? '#06b6d4' : '#ef4444'} ${((sensitivity - 1) / 2) * 100}%,
                  #1f2937 ${((sensitivity - 1) / 2) * 100}%,
                  #1f2937 100%)`
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Bajo</span>
              <span>Medio</span>
              <span>Alto</span>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-3">
            {sensitivity === 1 && 'Detecta solo amenazas evidentes y de alto riesgo'}
            {sensitivity === 2 && 'Balance entre precisión y cobertura de amenazas'}
            {sensitivity === 3 && 'Máxima protección, puede generar falsos positivos'}
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
            <p className="text-gray-400 text-sm">Gestiona alertas y sonidos</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-xl">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-medium">Alertas Sonoras</p>
              <p className="text-gray-500 text-sm">Reproducir sonido al detectar amenazas</p>
            </div>
          </div>
          <button
            onClick={handleNotificationsToggle}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              notifications ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                notifications ? 'translate-x-7' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Email Security Alerts */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-orange-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <Mail className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Notificaciones de Seguridad</h3>
            <p className="text-gray-400 text-sm">Recibe alertas por correo cuando se detecten amenazas</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="p-4 bg-black/20 border border-gray-800 rounded-xl">
            <label className="text-white font-medium mb-3 block">Correo de Alertas</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={alertEmail}
                  onChange={handleEmailChange}
                  placeholder="admin@empresa.com"
                  className="w-full pl-11 pr-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all duration-300"
                />
              </div>
              <button
                onClick={handleSaveEmail}
                disabled={!alertEmail.includes('@')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  emailSaved 
                    ? 'bg-emerald-600 text-white' 
                    : alertEmail.includes('@')
                    ? 'bg-orange-600 hover:bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {emailSaved ? (
                  <>
                    <Save className="w-4 h-4" />
                    Guardado
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">Este correo recibira alertas de phishing critico</p>
          </div>

          {/* Toggle for Phishing Alerts */}
          <div className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              {emailAlertsEnabled ? (
                <ToggleRight className="w-5 h-5 text-orange-400" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <p className="text-white font-medium">Activar alertas por Phishing Critico</p>
                <p className="text-gray-500 text-sm">Enviar correo cuando se detecte riesgo Alto o Critico</p>
              </div>
            </div>
            <button
              onClick={handleEmailAlertsToggle}
              disabled={!alertEmail.includes('@')}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                emailAlertsEnabled ? 'bg-orange-600' : 'bg-gray-600'
              } ${!alertEmail.includes('@') ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  emailAlertsEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Status indicator */}
          {emailAlertsEnabled && alertEmail.includes('@') && (
            <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <p className="text-orange-300 text-sm">
                Alertas activas para: <span className="font-medium">{alertEmail}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Zona Peligrosa</h3>
            <p className="text-red-300/70 text-sm">Acciones irreversibles</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-between p-4 bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-400" />
              <div className="text-left">
                <p className="text-white font-medium group-hover:text-red-200">Borrar Historial Completo</p>
                <p className="text-red-400/60 text-sm">Elimina todos los registros guardados</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-semibold">
              Eliminar
            </div>
          </button>
        </div>
      </div>

      {/* Save Confirmation */}
      <div className="flex items-center justify-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <Save className="w-4 h-4 text-emerald-400" />
        <p className="text-emerald-400 text-sm font-medium">Los cambios se guardan automáticamente</p>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}
