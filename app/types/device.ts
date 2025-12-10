export interface Payload {
  sku: string
  device: string
  capabilities: Capability[]
}

export interface DeviceUIState {
  colorValue: number ;
  brightnessValue: number;
  powerState: boolean ;
  switchState: number;
}


export interface GroupState {
  colorValue: number | null ;
  brightnessValue: number | null;
  switchState: number| null;
}

export interface DeviceUIMap extends Record<string, DeviceUIState> {}

type UIUpdate =
  | number
  | { brightnessValue: number }
  | { colorValue: number }
  | { switchState: number };

export interface ControlProps {
  device: string;
  sku : string;
  capabilityInstance: string;
  capabilityType: string;
  initialValue: any;
  children?: React.ReactNode;
  onLocalChange?: any;
}

export interface Capability {
  type: string
  instance: string
  state?: {
      value: any
    }
  parameters?: any
}

export interface ApiDeviceData {
  device: string
  deviceName: string
  sku: string
  type: string
  capabilities: Capability[]
}

export interface DeviceData extends ApiDeviceData {
  colorValue: number
  brightnessValue: number
  online: boolean
  switch: number
  selected: boolean
}
  