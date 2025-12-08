'use client'

import React, {useEffect, useState} from "react"
import {sendControlRequest} from '@/app/components/Device';
import { ControlProps } from "@/app/types/device";

function numberToHex(n : number) {
  return n.toString(16).padStart(6, "0");
}

function hexToNumber(hex : string) {
  return parseInt(hex.replace("#", ""), 16);
}

export default function ColorControl({device, sku, capabilityInstance, capabilityType, initialValue, onLocalChange = () => {}, children} : ControlProps) {
  const [colorValue, setColorValue] = useState(initialValue); 
  const hexColorValue = "#" + numberToHex(colorValue);

  function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const nextValue = hexToNumber(e.target.value);
    setColorValue(nextValue);
    onLocalChange(nextValue)
    console.log("nextValue", nextValue)
    sendControlRequest(device, sku, capabilityInstance, capabilityType, nextValue);
  }

  return (
    <div>
      <label htmlFor="colorSelector">
        color: 
        <input
          id="colorSelector"
          type="color"
          value={hexColorValue}
          onChange={handleChange}
        />
      </label>
    </div>
  ); 
}

