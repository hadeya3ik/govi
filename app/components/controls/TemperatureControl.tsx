'use client'

import React, { useState, useEffect } from "react";
import { sendControlRequest } from '@/app/components/Device';
import { ControlProps } from "@/app/types/device";
import {getTempHexColor} from '@/app/helpers/helpers.js'

export default function TemperatureControl({ device, sku, capabilityInstance, capabilityType, initialValue, onLocalChange = () => {}
}: ControlProps) {

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
    onLocalChange({ colorValue: nextValue })

    const { r, g, b } = getTempHexColor(nextValue);
    const hex = ((r << 16) | (g << 8) | b); // convert rgb → hex number

    setColor(`rgb(${r}, ${g}, ${b})`);
    // onLocalChange(hex);

    sendControlRequest(device, sku, capabilityInstance, capabilityType, nextValue);
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
