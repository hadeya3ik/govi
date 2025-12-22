'use client'
import React, {useState, useEffect} from 'react'
import BrightnessControl from '@/app/components/controls/BrightnessControl'
import ColorRgbControl from '@/app/components/controls/ColorRgbControl'
import PowerSwitchControl from '@/app/components/controls/PowerSwitchControl'
import ColorTemperatureKControl from '@/app/components/controls/ColorTemperatureKControl'
import { DeviceStateDetails, DeviceProps } from "../types/device"
import {getTempHexColor, getRGBFromNumber} from '@/app/helpers/helpers.js'



function Device({id, colorRgb, colorTemperatureK, brightness, online, powerSwitch, deviceName, sku, onUpdate} : DeviceProps) {
  let { r, g, b } = colorRgb > 10000 ? getRGBFromNumber(colorRgb) : getTempHexColor(colorTemperatureK);
  let bulbColor = `rgb(${r}, ${g}, ${b})`;  

  return (<div>
    <BulbDisplay bulbColor={bulbColor} bulbBrightness={brightness}></BulbDisplay>
    <p>{deviceName}</p>
    <span>online: {online}</span>
    <PowerSwitchControl device={id} sku={sku} initialValue={powerSwitch} onLocalChange={onUpdate}></PowerSwitchControl>
    <BrightnessControl device={id} sku={sku} initialValue={brightness} onLocalChange={onUpdate}></BrightnessControl>
    <ColorTemperatureKControl device={id} sku={sku} initialValue={colorTemperatureK} onLocalChange={onUpdate}></ColorTemperatureKControl>
    <ColorRgbControl device={id} sku={sku} initialValue={colorRgb} onLocalChange={onUpdate}></ColorRgbControl>
  </div>)
}

function BulbDisplay({bulbColor, bulbBrightness} : {bulbColor : string, bulbBrightness : number}) {
  return (<div
    className='bulb w-[100px] h-[100px] rounded-full'
    style={{ 
      backgroundColor: bulbColor, 
      opacity: bulbBrightness / 100
      }}> 
  </div>)
}

async function sendControlRequest(
    ID : string,
    sku : string, 
    instance : string, 
    type : string, 
    value : number) 
  {
  const req = await fetch("/api/control", 
    {
      method : "POST",
      body : JSON.stringify({
        sku,
        ID,
        value,
        instance, 
        type
      }),
      headers : {
        "Content-Type" : "application/json",
      }
    }) 
}

export default Device;
export { sendControlRequest };