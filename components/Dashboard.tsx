
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Activity, 
  BrainCircuit,
  Loader2,
  RefreshCcw
} from 'lucide-react';
import { IoTDevice, DeviceStatus } from '../types';
import { getSmartInsights } from '../services/geminiService';

interface DashboardProps {
  devices: IoTDevice[];
}

const Dashboard: React.FC<DashboardProps> = ({ devices }) => {
  const [insights, setInsights] = React.useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = React.useState(false);

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === DeviceStatus.ONLINE).length,
    alerts: devices.filter(d => d.status === DeviceStatus.ALERT).length,
    avgUptime: '99.9%'
  };

  const fetchAIInsights = async () => {
    setIsInsightLoading(true);
    const result = await getSmartInsights(devices);
    setInsights(result);
    setIsInsightLoading(false);
  };

  // Aggregate telemetry for trend chart
  const trendData = devices[0]?.telemetry.map((t, i) => {
    const dataPoint: any = { time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    devices.forEach(d => {
      dataPoint[d.id] = d.telemetry[i]?.value || 0;
    });
    return dataPoint;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Connected Devices', val: stats.total, sub: 'Global fleet', icon: <Wifi size={24} />, color: 'text-indigo-500' },
          { label: 'Online Now', val: stats.online, sub: 'Active nodes', icon: <Activity size={24} />, color: 'text-emerald-500' },
          { label: 'Active Alerts', val: stats.alerts, sub: 'Needs attention', icon: <AlertTriangle size={24} />, color: 'text-rose-500' },
          { label: 'System Uptime', val: stats.avgUptime, sub: 'Past 30 days', icon: <RefreshCcw size={24} />, color: 'text-blue-500' },
        ].map((s, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-slate-800/50 ${s.color}`}>
                {s.icon}
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">LIVE</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-100 mb-1">{s.val}</h3>
            <p className="text-sm font-medium text-slate-400">{s.label}</p>
            <p className="text-xs text-slate-500 mt-2">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Visualization */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Fleet Telemetry Trends</h3>
              <p className="text-sm text-slate-500">Real-time aggregate data flow across major sensors</p>
            </div>
            <select className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 outline-none">
              <option>Last 1 Hour</option>
              <option>Last 24 Hours</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                {devices.map((d, i) => (
                  <Area 
                    key={d.id}
                    type="monotone" 
                    dataKey={d.id} 
                    name={d.name}
                    stroke={i % 2 === 0 ? '#6366f1' : '#10b981'} 
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gemini AI Insights */}
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Smart Diagnostic</h3>
              <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">AI Analysis Engine</p>
            </div>
          </div>

          <div className="flex-1 relative">
            {!insights && !isInsightLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-slate-400 text-sm mb-4">Run diagnostics to generate AI-driven maintenance insights for your device fleet.</p>
                <button 
                  onClick={fetchAIInsights}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  Start Diagnostic Run
                </button>
              </div>
            )}

            {isInsightLoading && (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="text-indigo-500 animate-spin" size={32} />
                <p className="text-indigo-300 text-sm font-medium animate-pulse">Consulting Gemini Intelligence...</p>
              </div>
            )}

            {insights && (
              <div className="h-full overflow-y-auto space-y-4 pr-2">
                <div className="bg-slate-900/50 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed border border-slate-800">
                  <div className="prose prose-invert prose-sm">
                    {insights.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={fetchAIInsights}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-xl transition-all"
                >
                  Refresh Insights
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
