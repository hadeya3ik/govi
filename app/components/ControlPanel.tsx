import BrightnessControl from '@/app/components/controls/BrightnessControl'
import ColorRgbControl from '@/app/components/controls/ColorRgbControl'
import PowerSwitchControl from '@/app/components/controls/PowerSwitchControl'
import ColorTemperatureKControl from '@/app/components/controls/ColorTemperatureKControl'
import { DeviceProps } from "../types/device"

export default function ControlPanel({id, colorRgb, colorTemperatureK, brightness, online, powerSwitch, deviceName, sku, onUpdate} : DeviceProps) {
  return (<div>
    <PowerSwitchControl device={id} sku={sku} initialValue={powerSwitch} onLocalChange={onUpdate}></PowerSwitchControl>
    <BrightnessControl device={id} sku={sku} initialValue={brightness} onLocalChange={onUpdate}></BrightnessControl>
    <ColorTemperatureKControl device={id} sku={sku} initialValue={colorTemperatureK} onLocalChange={onUpdate}></ColorTemperatureKControl>
    <ColorRgbControl device={id} sku={sku} initialValue={colorRgb} onLocalChange={onUpdate}></ColorRgbControl>
  </div>)
}