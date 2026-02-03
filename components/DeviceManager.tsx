
import React from 'react';
import { 
  MoreHorizontal, 
  ArrowUpRight, 
  Power, 
  Trash2, 
  Edit3,
  Search,
  Plus,
  // Fix: Add Cpu to the imported icons from lucide-react
  Cpu
} from 'lucide-react';
import { IoTDevice, DeviceStatus, DeviceType } from '../types';

interface DeviceManagerProps {
  devices: IoTDevice[];
  onToggleStatus: (id: string) => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ devices, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Device Inventory</h1>
          <p className="text-slate-500 text-sm">Manage lifecycle, configuration, and monitoring of all edge nodes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or name..."
              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm">
            <Plus size={20} />
            <span className="hidden sm:inline">Add Device</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDevices.map((device) => (
          <div key={device.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`
                px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${device.status === DeviceStatus.ONLINE ? 'bg-emerald-500/10 text-emerald-400' : 
                  device.status === DeviceStatus.ALERT ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'}
              `}>
                {device.status}
              </div>
              <button className="text-slate-600 hover:text-slate-400 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
                {device.name}
                <ArrowUpRight size={14} className="text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 font-mono">{device.id}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Type</span>
                <span className="text-slate-300 font-medium">{device.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Location</span>
                <span className="text-slate-300 font-medium">{device.location}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Firmware</span>
                <span className="text-slate-300 font-medium">{device.firmware}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:text-indigo-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all">
                  <Edit3 size={16} />
                </button>
                <button className="p-2 text-slate-500 hover:text-rose-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
              <button 
                onClick={() => onToggleStatus(device.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                  ${device.status === DeviceStatus.ONLINE 
                    ? 'bg-rose-600/10 text-rose-400 hover:bg-rose-600/20' 
                    : 'bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20'}
                `}
              >
                <Power size={14} />
                {device.status === DeviceStatus.ONLINE ? 'Shutdown' : 'Startup'}
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredDevices.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cpu className="text-slate-600" size={32} />
            </div>
            <h3 className="text-slate-300 font-bold">No devices found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceManager;
