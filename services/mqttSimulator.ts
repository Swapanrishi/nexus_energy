
import { IoTDevice, DeviceStatus } from '../types';

type MessageCallback = (deviceId: string, value: number) => void;

class MqttSimulator {
  private interval: number | null = null;
  private subscribers: MessageCallback[] = [];

  start(devices: IoTDevice[]) {
    if (this.interval) return;
    
    this.interval = window.setInterval(() => {
      devices.forEach(device => {
        if (device.status !== DeviceStatus.ONLINE) return;
        
        let delta = (Math.random() - 0.5) * 2;
        const lastVal = device.telemetry[device.telemetry.length - 1]?.value || 0;
        const newVal = lastVal + delta;
        
        this.subscribers.forEach(cb => cb(device.id, newVal));
      });
    }, 3000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  subscribe(callback: MessageCallback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }
}

export const mqttService = new MqttSimulator();
