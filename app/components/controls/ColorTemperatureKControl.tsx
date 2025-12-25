'use client'
import React, { useState, useEffect } from "react"
import { ControlDevices } from '@/app/helpers/ApiRequest'
import { DeviceControlProps } from "@/app/types/device"
import {getTempHexColor} from '@/app/helpers/colors.js'
// import {TemperatureSlider} from '@/app/components/colorSliders/ColorSliders'
import { Slider } from "@/app/components/colorSliders/Slider"

const CAPABILITY_INSTANCE = "colorTemperatureK"
const CAPABILITY_TYPE = "devices.capabilities.color_setting"


const trackHeight = 0.88
const thumbDiameterSmall = 1.4
const thumbDiameterBig = 1.6

export default function ColorTemperatureKControl({device, sku, initialValue, onLocalChange}: DeviceControlProps) {
  const [tempLevel, setTempLevel] = useState(initialValue);
  const [color, setColor] = useState("rgb(255,210,157)");

  useEffect(() => {
    if (initialValue == null) return;

    setTempLevel(initialValue);
    const { r, g, b } = getTempHexColor(initialValue);
    setColor(`rgb(${r}, ${g}, ${b})`);
  }, [initialValue]);

  function handleChange(nextValue: number) {
    setTempLevel(nextValue)
    device.forEach((d) => { onLocalChange(d, { colorTemperatureK: nextValue })})
    const { r, g, b } = getTempHexColor(nextValue)
    setColor(`rgb(${r}, ${g}, ${b})`)
    
    ControlDevices(device, sku, nextValue, CAPABILITY_INSTANCE, CAPABILITY_TYPE)
}

  return (
    <div className="w-full">
    <Slider
      thumbBackground={`hsl(100%, 100%, 50%)`}
      trackBackground="linear-gradient(to right, rgb(255, 210, 157), rgb(255, 255, 255), rgb(141, 205, 251) )"
      min={2700}
      max={6500}
      value={tempLevel ?? 2700}
      handleMoveSlider={handleChange}
    />
    </div>
  );
}
