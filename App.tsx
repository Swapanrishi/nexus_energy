
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DeviceManager from './components/DeviceManager';
import Toast, { ToastType } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { IoTDevice, DeviceStatus } from './types';
import { ApiService } from './services/api';
import { mqttService } from './services/mqttSimulator';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  // Sync state with local database (localStorage)
  const loadData = async () => {
    try {
      const data = await ApiService.getDevices();
      setDevices(data);
    } catch (error) {
      showToast('Failed to load system data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle incoming MQTT simulated telemetry
  const handleTelemetryUpdate = useCallback((deviceId: string, value: number) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newTelemetry = [
          ...device.telemetry.slice(1),
          { timestamp: Date.now(), value, unit: device.telemetry[0]?.unit || '' }
        ];
        // Background sync simulation
        ApiService.saveTelemetry(deviceId, value);
        return { ...device, telemetry: newTelemetry, lastPing: Date.now() };
      }
      return device;
    }));
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      mqttService.start(devices);
      const unsubscribe = mqttService.subscribe(handleTelemetryUpdate);
      return () => {
        mqttService.stop();
        unsubscribe();
      };
    }
  }, [devices.length, handleTelemetryUpdate]);

  const toggleDeviceStatus = async (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;

    const newStatus = device.status === DeviceStatus.ONLINE ? DeviceStatus.OFFLINE : DeviceStatus.ONLINE;
    
    try {
      await ApiService.updateDeviceStatus(id, newStatus);
      setDevices(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      showToast(`${device.name} is now ${newStatus.toLowerCase()}`, 'success');
    } catch (error) {
      showToast(`Failed to update ${device.name}`, 'error');
    }
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard devices={devices} />;
      case 'devices':
        return <DeviceManager devices={devices} onToggleStatus={toggleDeviceStatus} />;
      case 'telemetry':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-slate-900 rounded-3xl border border-slate-800">
             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-indigo-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
             </div>
             <h2 className="text-xl font-bold text-slate-100 mb-2">Advanced Telemetry Workbench</h2>
             <p className="text-slate-500 max-w-md">Detailed waveform analysis and custom MQTT topic subscription management for deep-dive hardware debugging.</p>
             <button className="mt-8 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-6 py-3 rounded-2xl transition-all">Enable Lab Mode</button>
          </div>
        );
      case 'alerts':
        return (
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Recent Security & Performance Alerts</h2>
            <div className="space-y-4">
               {devices.filter(d => d.status === DeviceStatus.ALERT).map(d => (
                 <div key={d.id} className="flex items-center justify-between p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                     </div>
                     <div>
                       <h4 className="text-rose-100 font-semibold">{d.name}</h4>
                       <p className="text-rose-400/70 text-xs">Abnormal vibration detected at {new Date(d.lastPing).toLocaleTimeString()}</p>
                     </div>
                   </div>
                   <button 
                    onClick={() => showToast('Alert acknowledged', 'success')}
                    className="bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-rose-400 transition-colors"
                   >
                    Acknowledge
                   </button>
                 </div>
               ))}
               {devices.filter(d => d.status === DeviceStatus.ALERT).length === 0 && (
                 <p className="text-slate-500 text-center text-sm py-10">No active alerts. System is nominal.</p>
               )}
            </div>
          </div>
        );
      default:
        return <Dashboard devices={devices} />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {renderView()}
      </Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </ErrorBoundary>
  );
};

export default App;
