'use client'
import React, { useState, useEffect } from "react"
import { ControlDevices } from '@/app/helpers/ApiRequest'
import { DeviceControlProps } from "@/app/types/device"
import {getTempHexColor} from '@/app/helpers/colors.js'

const CAPABILITY_INSTANCE = "colorTemperatureK"
const CAPABILITY_TYPE = "devices.capabilities.color_setting"

export default function ColorTemperatureKControl({device, sku, initialValue, onLocalChange}: DeviceControlProps) {
  const [tempLevel, setTempLevel] = useState(initialValue);
  const [color, setColor] = useState("rgb(255,210,157)");

  useEffect(() => {
    if (initialValue == null) return;

    setTempLevel(initialValue);
    const { r, g, b } = getTempHexColor(initialValue);
    setColor(`rgb(${r}, ${g}, ${b})`);
  }, [initialValue]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = Number(e.target.value);
    setTempLevel(nextValue);
    device.forEach((d) => {onLocalChange(d, { colorTemperatureK: nextValue })})


    const { r, g, b } = getTempHexColor(nextValue);
    setColor(`rgb(${r}, ${g}, ${b})`);

    ControlDevices(device, sku, nextValue, CAPABILITY_INSTANCE, CAPABILITY_TYPE);
  }

  return (
    <div>
      <label htmlFor="tempSlider">
        temperature: 
        <input
          id="tempSlider"
          type="range"
          min={2700}
          max={6500}
          value={tempLevel ?? 2700}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}