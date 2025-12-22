import {getTempHexColor, getRGBFromNumber} from '@/app/helpers/helpers.js'
import { DeviceProps } from "../types/device"

export default function Device({id, colorRgb, colorTemperatureK, brightness, online, powerSwitch, deviceName, sku, onUpdate} : DeviceProps) {
  let { r, g, b } = colorRgb > 10000 ? getRGBFromNumber(colorRgb) : getTempHexColor(colorTemperatureK);
  let bulbColor = `rgb(${r}, ${g}, ${b})`;  

  return (<div>
    <BulbDisplay bulbColor={bulbColor} bulbBrightness={brightness}></BulbDisplay>
    <p>{deviceName}</p>
    <span>online: {online}</span>
  </div>)
}

function BulbDisplay({bulbColor, bulbBrightness} : {bulbColor : string, bulbBrightness : number}) {
  return (<div
    className='bulb w-[100px] h-[100px] rounded-full'
    style={{ 
      backgroundColor: bulbColor, 
      opacity: bulbBrightness / 100
      }}> 
  </div>)
}

async function sendControlRequest(
    ID : string,
    sku : string, 
    instance : string, 
    type : string, 
    value : number) 
  {
  const req = await fetch("/api/control", 
    {
      method : "POST",
      body : JSON.stringify({
        sku,
        ID,
        value,
        instance, 
        type
      }),
      headers : {
        "Content-Type" : "application/json",
      }
    }) 
}

export {sendControlRequest}
