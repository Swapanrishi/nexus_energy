
import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Activity, 
  Settings, 
  ShieldAlert, 
  Zap,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'devices', label: 'Device Manager', icon: <Cpu size={20} /> },
    { id: 'telemetry', label: 'Live Telemetry', icon: <Activity size={20} /> },
    { id: 'alerts', label: 'Alerts Hub', icon: <ShieldAlert size={20} /> },
    { id: 'settings', label: 'System Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 z-50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Zap className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Nexus IoT
          </h1>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeView === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300 uppercase">System Status</span>
            </div>
            <p className="text-xs text-slate-500">Node v20.10.0-Stable</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-400"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-medium text-slate-400 flex items-center gap-2">
              {navItems.find(i => i.id === activeView)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-slate-200">Admin User</span>
              <span className="text-xs text-slate-500 uppercase">Global Auditor</span>
            </div>
            <img 
              src="https://picsum.photos/40/40" 
              className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-xl"
              alt="Avatar"
            />
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
