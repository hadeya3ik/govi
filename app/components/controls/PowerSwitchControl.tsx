'use client'
import React, {useState, useEffect} from "react"
import {ControlDevices} from '@/app/helpers/ApiRequest'
import { DeviceControlProps } from "@/app/types/device"

const CAPABILITY_INSTANCE = "powerSwitch"
const CAPABILITY_TYPE = "devices.capabilities.on_off"

export default function PowerSwitchControl({device, sku, initialValue, onLocalChange} : DeviceControlProps) {
  const [powerState, setPowerState] = useState(initialValue)

  function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
    const nextValue = e.target.checked ? 1 : 0;

    if (onLocalChange) {
      device.forEach((d) => {onLocalChange(d, { powerSwitch: nextValue })})
    }
    
    setPowerState(nextValue)
    ControlDevices(device, sku, nextValue, CAPABILITY_INSTANCE, CAPABILITY_TYPE);
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