import BrightnessControl from '@/app/components/controls/BrightnessControl'
import ColorRgbControl from '@/app/components/controls/ColorRgbControl'
import PowerSwitchControl from '@/app/components/controls/PowerSwitchControl'
import ColorTemperatureKControl from '@/app/components/controls/ColorTemperatureKControl'
import { DeviceProps, ControlProps } from "../../types/device"

export default function ControlPanel({id, colorRgb, colorTemperatureK, brightness, online, powerSwitch, deviceName, sku, onUpdate} : ControlProps) {
  return (
  <div className='control-panel flex flex-col gap-[8px]'>
    <div className='flex items-center justify-between w-full'>
      <PowerSwitchControl device={id} sku={sku} initialValue={powerSwitch} onLocalChange={onUpdate}></PowerSwitchControl>
      <div>
        {/* <span className='text-[32px] m-x-4'>{online? '✓' : '✕'}</span> */}
        <span className='uppercase text-[24px]'>{deviceName}</span>
      </div>
    </div>
    <div className='flex flex-col gap-4 w-full'>
      <BrightnessControl device={id} sku={sku} initialValue={brightness} onLocalChange={onUpdate}></BrightnessControl>
      <ColorTemperatureKControl device={id} sku={sku} initialValue={colorTemperatureK} onLocalChange={onUpdate}></ColorTemperatureKControl>
      <ColorRgbControl device={id} sku={sku} initialValue={colorRgb} onLocalChange={onUpdate}></ColorRgbControl> 
    </div>
  </div>)
}