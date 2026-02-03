
export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  ALERT = 'ALERT'
}

export enum DeviceType {
  TEMPERATURE_SENSOR = 'TEMPERATURE_SENSOR',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR',
  POWER_METER = 'POWER_METER',
  SMART_VALVE = 'SMART_VALVE',
  MOTION_DETECTOR = 'MOTION_DETECTOR'
}

export interface Telemetry {
  timestamp: number;
  value: number;
  unit: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string;
  lastPing: number;
  telemetry: Telemetry[];
  firmware: string;
}

export interface SystemStats {
  totalDevices: number;
  onlineDevices: number;
  alertsCount: number;
  avgLatency: number;
}
