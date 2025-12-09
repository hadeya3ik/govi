'use client'

import React, {useState, useEffect} from "react"
import {sendControlRequest} from '@/app/components/Device';
import { ControlProps } from "@/app/types/device";

export default function PowerControl({device, sku, capabilityInstance, capabilityType, initialValue, children} : ControlProps) {
  const [powerState, setPowerState] = useState<0 | 1>(initialValue)

  function handleClick(e: React.ChangeEvent<HTMLInputElement>) {
    const toggleSwitch = (value : number) => value === 0 ? 1 : 0  
    setPowerState(prev => {
      const nextValue = toggleSwitch(prev);
      sendControlRequest(device, sku, capabilityInstance, capabilityType, nextValue);
      return nextValue;
    });
  }
  useEffect(() => {
  if (initialValue == null) return;
  setPowerState(initialValue);
  }, [initialValue]);

  return (
    <div>
      <label htmlFor="powerSwitch">
        Power: 
        <input checked={powerState === 1} type="checkbox" id="powerSwitch" onChange={handleClick}>
        </input>
      </label>
      {/* <p>{children}</p> */}
    </div>
  ) 
}
