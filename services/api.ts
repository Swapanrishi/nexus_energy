
import { IoTDevice, DeviceStatus } from '../types';
import { INITIAL_DEVICES } from '../constants';

const STORAGE_KEY = 'nexus_iot_devices';

export const ApiService = {
  // Simulates fetching devices from a MongoDB collection
  async getDevices(): Promise<IoTDevice[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Seed data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEVICES));
    return INITIAL_DEVICES;
  },

  // Simulates a PATCH request to the Express backend
  async updateDeviceStatus(id: string, status: DeviceStatus): Promise<IoTDevice> {
    const devices = await this.getDevices();
    const index = devices.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Device not found');
    
    devices[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    return devices[index];
  },

  // Simulates bulk telemetry updates (MQTT payload sink)
  async saveTelemetry(id: string, value: number): Promise<void> {
    const devices = await this.getDevices();
    const index = devices.findIndex(d => d.id === id);
    if (index !== -1) {
      const newTelemetry = [
        ...devices[index].telemetry.slice(1),
        { timestamp: Date.now(), value, unit: devices[index].telemetry[0]?.unit || '' }
      ];
      devices[index].telemetry = newTelemetry;
      devices[index].lastPing = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    }
  }
};
