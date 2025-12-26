import React, {useState, useEffect} from "react"
import {ControlDevices} from '@/app/helpers/ApiRequest'
import {getRGBFromNumber} from '@/app/helpers/colors'
import { DeviceControlProps } from "@/app/types/device"
import { Slider } from "@/app/components/colorSliders/Slider"


const CAPABILITY_INSTANCE = "brightness";
const CAPABILITY_TYPE = "devices.capabilities.range";

export default function BrightnessControl({device, sku, initialValue, onLocalChange}: DeviceControlProps) {

  const [brightnessLevel, setBrightnessLevel] = useState(initialValue)

  useEffect(() => {
    if (initialValue == null) return
    setBrightnessLevel(initialValue)
  }, [initialValue])

  function handleChange(nextValue: number) {
    setBrightnessLevel(nextValue)
    device.forEach((d) => { onLocalChange(d, { brightness: nextValue })})      
    ControlDevices(device, sku, nextValue, CAPABILITY_INSTANCE, CAPABILITY_TYPE)
  }

  return (
    <div className="w-full">
      <Slider
        thumbBackground={`hsl(100%, 100%, 50%)`}
        trackBackground={`linear-gradient(
          to right,
          rgb(44, 44, 44),
          rgb(100, 100, 100))`}
        min={0}
        max={100}
        value={brightnessLevel}
        handleMoveSlider={handleChange}
      />
    </div>
  )
}