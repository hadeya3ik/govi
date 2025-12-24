'use client'
import React, { useState, useEffect } from "react"
import { ControlDevices } from '@/app/helpers/ApiRequest'
import { DeviceControlProps } from "@/app/types/device"
import {getTempHexColor} from '@/app/helpers/colors.js'
import {TemperatureSlider} from '@/app/components/colorSliders/ColorSliders'

const CAPABILITY_INSTANCE = "colorTemperatureK"
const CAPABILITY_TYPE = "devices.capabilities.color_setting"


const trackHeight = 0.88
const thumbDiameterSmall = 1.4
const thumbDiameterBig = 1.6

export default function ColorTemperatureKControl({device, sku, initialValue, onLocalChange}: DeviceControlProps) {
  const [tempLevel, setTempLevel] = useState(initialValue);
  const [color, setColor] = useState("rgb(255,210,157)");
   const [sliderIsBeingTouched, setSliderIsBeingTouched] = useState(false)
  const [sliderThumbIsBeingTouched, setSliderThumbIsBeingTouched] = useState(false)


  const handleTouchStart = () => {
    setSliderIsBeingTouched(true)
  }

  const handleTouchEnd = () => {
    setSliderIsBeingTouched(false)
    setSliderThumbIsBeingTouched(false)
  }

  const currentThumbDiameter = sliderThumbIsBeingTouched
    ? thumbDiameterBig
    : thumbDiameterSmall



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
    if (sliderIsBeingTouched) setSliderThumbIsBeingTouched(true)


    const { r, g, b } = getTempHexColor(nextValue);
    setColor(`rgb(${r}, ${g}, ${b})`);

    ControlDevices(device, sku, nextValue, CAPABILITY_INSTANCE, CAPABILITY_TYPE);
  }

  return (
    <div className="w-[300px]">
      <input
      type="range"
      className={`color-slider`}
      style={
        {
          '--thumb-size': `${currentThumbDiameter}em`,
          '--thumb-bg': 'none',
          '--track-bg': "linear-gradient(to right, rgb(255, 210, 157), rgb(255, 255, 255), rgb(141, 205, 251) )",
          '--track-height': `${trackHeight}em`,
          '--thumb-size-big': `${thumbDiameterBig}em`,
        } as React.CSSProperties
      }
      min={2700}
      max={6500}
      step={50}
      value={tempLevel ?? 2700}
      onChange={handleChange}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
    </div>
  );
}
