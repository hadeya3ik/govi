import React, {useState} from "react"
import {sendControlRequest} from '@/app/components/Device';
import { ControlProps } from "@/app/types/device";

export default function TemperatureControl({device, sku, capabilityInstance, capabilityType, initialValue, children} : ControlProps) {
  const [tempLevel, setTempLevel] = useState(initialValue)

  function handleChange(e :  React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault(); 
    const nextValue = e.target.value; 
    sendControlRequest(device, sku, capabilityInstance, capabilityType, Number(nextValue));
    setTempLevel(nextValue);
  }

  return (
    <div>
      <label htmlFor="tempSlider">
        temperature : 
        <input 
          id="tempSlider"
          type="range"
          min={2000}
          max={9000}
          value={tempLevel}
          onChange={handleChange}
        ></input>
      </label>
      {/* <p>{children}</p> */}
    </div>
  ) 
}
