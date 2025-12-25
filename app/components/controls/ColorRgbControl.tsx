'use client'

import React, { useState, useEffect} from "react"
import {ControlDevices} from '@/app/helpers/ApiRequest'
import {packedRgbToHsla, hslaToPackedRgb} from '@/app/helpers/colors'
import { DeviceControlProps } from "@/app/types/device"
import {HueSlider, LightnessSlider, SaturationSlider} from '@/app/components/colorSliders/ColorSliders'

const CAPABILITY_INSTANCE = "colorRgb"
const CAPABILITY_TYPE = "devices.capabilities.color_setting"
const MIN_LIGHTNESS = 50
const DEFAULT_SATURATION = 100

export default function ColorRgbControl({device, sku, initialValue, onLocalChange = () => {}} : DeviceControlProps) {
  const [colorHsla, setColorHsla] = useState(packedRgbToHsla(initialValue));
  
  useEffect(() => {
    if (initialValue == null) return;
    const HslaValues = packedRgbToHsla(initialValue)
    setColorHsla({...HslaValues, s: 100,  l: Math.max(MIN_LIGHTNESS, HslaValues.l),} );
  }, [initialValue]);
  
  function handleChangeHSLA(newColor : { h: number, s: number, l: number, a: number }) {
    setColorHsla(newColor);
    const RgbInteger = hslaToPackedRgb(newColor)
     device.forEach((d) => {onLocalChange(d, { colorRgb: RgbInteger })})
    ControlDevices(device, sku, RgbInteger, CAPABILITY_INSTANCE, CAPABILITY_TYPE);
  };

  return (
    <div className="w-[300px]">
      <HueSlider handleChangeColor={handleChangeHSLA} color={colorHsla} />
      <LightnessSlider handleChangeColor={handleChangeHSLA} color={colorHsla} />
      {/* <SaturationSlider handleChangeColor={handleChangeHSLA} color={colorHsla} /> */}
    </div>
  ); 
}
