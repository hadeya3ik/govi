'use client'

import React, {useState, useEffect} from "react"
import {sendControlRequest} from '@/app/components/Device';
import { ControlProps } from "@/app/types/device";

export default function PowerControl({device, sku, capabilityInstance, capabilityType, initialValue, onLocalChange = () => {}, children} : ControlProps) {
  const [powerState, setPowerState] = useState<0 | 1>(initialValue)

  function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
    // e.preventDefault();
    const nextValue = e.target.checked ? 1 : 0;

    if (onLocalChange) {
      onLocalChange({ switchState: nextValue })
    }
    setPowerState(nextValue)
    sendControlRequest(device, sku, capabilityInstance, capabilityType, nextValue);
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
      {/* <p>{children}</p> */}
    </div>
  ) 
}
