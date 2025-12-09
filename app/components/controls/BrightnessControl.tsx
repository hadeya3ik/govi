import React, {useEffect, useState} from "react"
import {sendControlRequest} from '@/app/components/Device';
import { ControlProps } from "@/app/types/device";

export default function BrightnessControl({device, sku, capabilityInstance, capabilityType, initialValue, onLocalChange = () => {}, children} : ControlProps) {

  const [brightnessLevel, setBrightnessLevel] = useState(initialValue)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const nextValue = Number(e.target.value); 
    sendControlRequest(device, sku, capabilityInstance, capabilityType, nextValue);
    setBrightnessLevel(nextValue);
    onLocalChange({ brightnessValue: nextValue })
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
      {/* <p>{children}</p> */}
    </div>
  )
}

