export interface Payload {
  sku: string
  device: string
  capabilities: Capability[]
}

export interface ControlProps {
  device: string;
  sku : string;
  capabilityInstance: string;
  capabilityType: string;
  initialValue: any;
  children?: React.ReactNode;
}

export interface Capability {
  type: string
  instance: string
  state?: {
      value: any
    }
  parameters?: any
}
  
export interface DeviceData {
  device: string
  deviceName: string
  sku: string
  type: string
  capabilities: Capability[]
}