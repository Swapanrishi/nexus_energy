
import { DeviceType, DeviceStatus, IoTDevice } from './types';

// Ensure all numeric literals are clean and not misinterpreted as octals
export const INITIAL_DEVICES: IoTDevice[] = [
  {
    id: 'DEV-001',
    name: 'Warehouse Temp A',
    type: DeviceType.TEMPERATURE_SENSOR,
    status: DeviceStatus.ONLINE,
    location: 'Building 1 - Zone A',
    lastPing: Date.now(),
    telemetry: Array.from({ length: 20 }, (_, i) => ({ 
      timestamp: Date.now() - (20 - i) * 60000, 
      value: 22.0 + Math.random() * 5.0, 
      unit: '°C' 
    })),
    firmware: 'v2.1.4'
  },
  {
    id: 'DEV-002',
    name: 'Main Server Humidity',
    type: DeviceType.HUMIDITY_SENSOR,
    status: DeviceStatus.ONLINE,
    location: 'Server Room',
    lastPing: Date.now(),
    telemetry: Array.from({ length: 20 }, (_, i) => ({ 
      timestamp: Date.now() - (20 - i) * 60000, 
      value: 45.0 + Math.random() * 10.0, 
      unit: '%' 
    })),
    firmware: 'v1.0.9'
  },
  {
    id: 'DEV-003',
    name: 'Chiller Valve #4',
    type: DeviceType.SMART_VALVE,
    status: DeviceStatus.ALERT,
    location: 'Basement Mechanical',
    lastPing: Date.now() - 300000,
    telemetry: Array.from({ length: 20 }, (_, i) => ({ 
      timestamp: Date.now() - (20 - i) * 60000, 
      value: Math.random() > 0.5 ? 1.0 : 0.0, 
      unit: 'State' 
    })),
    firmware: 'v3.5.2'
  },
  {
    id: 'DEV-004',
    name: 'Smart Meter North',
    type: DeviceType.POWER_METER,
    status: DeviceStatus.ONLINE,
    location: 'Main Entry',
    lastPing: Date.now(),
    telemetry: Array.from({ length: 20 }, (_, i) => ({ 
      timestamp: Date.now() - (20 - i) * 60000, 
      value: 1200.0 + Math.random() * 200.0, 
      unit: 'W' 
    })),
    firmware: 'v2.0.0'
  }
];
