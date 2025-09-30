import React, {useEffect, useState} from "react"
import {sendControlRequest} from '@/app/components/Device';
import { ControlProps } from "@/app/types/device";

export default function BrightnessControl({device, sku, capabilityInstance, capabilityType, initialValue, children} : ControlProps) {

  const [brightnessLevel, setBrightnessLevel] = useState(initialValue)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const nextValue = e.target.value; 
    sendControlRequest(device, sku, capabilityInstance, capabilityType, Number(nextValue));
    setBrightnessLevel(nextValue);
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

