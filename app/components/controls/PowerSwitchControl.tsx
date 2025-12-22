'use client'
import React, {useState, useEffect} from "react"
import {sendControlRequest} from '@/app/components/Device';
import { DeviceControlProps } from "@/app/types/device";

const CAPABILITY_INSTANCE = "powerSwitch"
const CAPABILITY_TYPE = "devices.capabilities.on_off"

export default function PowerSwitchControl({device, sku, initialValue, onLocalChange} : DeviceControlProps) {
  const [powerState, setPowerState] = useState(initialValue)

  function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
    const nextValue = e.target.checked ? 1 : 0;

    if (onLocalChange) {
      onLocalChange(device, { powerSwitch: nextValue })
    }
    
    setPowerState(nextValue)
    sendControlRequest(device, sku, CAPABILITY_INSTANCE, CAPABILITY_TYPE, nextValue);
  }

  useEffect(() => {
  if (initialValue == null) return;
    setPowerState(initialValue);
  }, [initialValue]);

  return (
    <div>
      <label htmlFor="powerSwitch">
        Power: 
        <input checked={powerState === 1} type="checkbox" id="powerSwitch" onChange={handleChange}>
        </input>
      </label>
    </div>
  ) 
}