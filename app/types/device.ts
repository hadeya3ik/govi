export interface Capability {
  type: string
  instance: string
  state?: {
      value: any
    }
  parameters?: any
}

export interface Payload {
  sku: string
  device: string
  capabilities: Capability[]
}

export interface StatePayload {
  code: number
  requestId : string
  message: string
  success: boolean
  payload : Payload
}

export interface DeviceState {
  colorRgb: number;
  colorTemperatureK : number;
  brightness: number;
  online: boolean ;
  powerSwitch: number;
}

export interface DeviceStateDetails extends DeviceState {
  deviceName: string;
  sku :string;
}

export interface DeviceUIMap extends Record<string, DeviceStateDetails> {}

export type DeviceProps = DeviceStateDetails & {
  id: string;
  onUpdate: (deviceId: string, update: any) => void;
};

export interface DeviceControlProps {
  device: string;
  sku: string; 
  initialValue: number;
  onLocalChange: (deviceId: string, update: any) => void;
}

export interface DeviceData {
  device: string
  deviceName: string
  sku: string
}

export interface ApiDeviceData extends DeviceData {
  type: string
  capabilities: Capability[]
}

export const defaultDeviceState: DeviceState = {
  colorRgb: 0,
  colorTemperatureK: 0,
  brightness: 0,
  online: false,
  powerSwitch: 0,
};