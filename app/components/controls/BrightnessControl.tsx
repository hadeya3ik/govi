import React, {useState} from "react"
import {ControlDevices} from '@/app/helpers/ApiRequest'
import { DeviceControlProps } from "@/app/types/device"

const CAPABILITY_INSTANCE = "brightness";
const CAPABILITY_TYPE = "devices.capabilities.range";

export default function BrightnessControl({device, sku, initialValue, onLocalChange}
  : DeviceControlProps
) 
  {
  const [brightnessLevel, setBrightnessLevel] = useState(initialValue)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const nextValue = Number(e.target.value); 
    ControlDevices(device, sku, nextValue, CAPABILITY_INSTANCE, CAPABILITY_TYPE);
    setBrightnessLevel(nextValue);
    device.forEach((d) => {onLocalChange(d, { brightness: nextValue })})
  }

  return (
    <div>
      <label htmlFor="brightnessSlider">
        Brightness: 
        <input 
          id="brightnessSlider"
          type="range"
          min="0" 
          max="100"
          value={brightnessLevel}
          onChange={handleChange}
        ></input>
      </label>
    </div>
  )
}