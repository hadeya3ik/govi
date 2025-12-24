'use client'

import React, { useState} from "react"
import {ControlDevices} from '@/app/helpers/ApiRequest'
import {rgbNumberToHsla, hslaToRgbNumber} from '@/app/helpers/colors'
import { DeviceControlProps } from "@/app/types/device"
import {HueSlider, LightnessSlider, SaturationSlider} from '@/app/components/color/index'

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
  const color = rgbNumberToHsla(colorValue)

  function handleChange(nextColor : {h: number, s: number, l: number, a: number}) {
    const nextValue = hslaToRgbNumber(
      nextColor.h,
      nextColor.s,
      nextColor.l
    )
    
    setColorValue(nextValue);
    device.forEach((d) => {onLocalChange(d, { colorRgb: nextValue })})
    ControlDevices(device, sku, nextValue, CAPABILITY_INSTANCE, CAPABILITY_TYPE);
  }

  return (
    <div>
      <HueSlider handleChangeColor={handleChange} color={color} />
      <LightnessSlider handleChangeColor={handleChange} color={color} />
      <SaturationSlider handleChangeColor={handleChange} color={color} />
    </div>
  ); 
}

