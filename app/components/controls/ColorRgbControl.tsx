'use client'

import React, {useEffect, useState} from "react"
import {sendControlRequest} from '@/app/components/Device';
import { DeviceControlProps } from "@/app/types/device";

const CAPABILITY_INSTANCE = "colorRgb"
const CAPABILITY_TYPE = "devices.capabilities.color_setting"

function numberToHex(n : number) {
  return n.toString(16).padStart(6, "0");
}

function hexToNumber(hex : string) {
  return parseInt(hex.replace("#", ""), 16);
}

export default function ColorRgbControl({device, sku, initialValue, onLocalChange = () => {}} : DeviceControlProps) {
  const [colorValue, setColorValue] = useState(initialValue); 
  const hexColorValue = "#" + numberToHex(colorValue);

  function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const nextValue = hexToNumber(e.target.value);
    setColorValue(nextValue);
    onLocalChange(device, { colorRgb: nextValue })
    console.log("nextValue", nextValue)
    sendControlRequest(device, sku, CAPABILITY_INSTANCE, CAPABILITY_TYPE, nextValue);
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