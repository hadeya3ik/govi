'use client'
import {resolveColorFromTemp, resolveColorFromRgb} from '@/app/helpers/colors.js'
import {BulbSvg} from '@/app/helpers/DeviceSvg'
import { DeviceProps } from "../types/device"
import { useEffect, useState, useRef } from 'react'

const RGB_THRESHOLD = 10000

export default function Device({id, colorRgb, colorTemperatureK, brightness, online, powerSwitch, deviceName, sku, onUpdate} : DeviceProps) {
  const [bulbColorObj, setBulbColorObj] = useState<null | string>(null)
  const prevRgb = useRef<number | null>(null)
  const prevTemp = useRef<number | null>(null)
  
  useEffect(() => {
    const isInitialRender = prevRgb.current === null && prevTemp.current === null
    
    // on the initial mount then we display whichever color (rgb, temperature) is non zero
    if (isInitialRender) {
      setBulbColorObj(
        (colorRgb > RGB_THRESHOLD) ? resolveColorFromRgb(colorRgb) : resolveColorFromTemp(colorTemperatureK)
      )
    }

    // otherwise if either is different then the previous render we update it
    if (!isInitialRender && prevRgb.current !== colorRgb) {
      setBulbColorObj(resolveColorFromRgb(colorRgb))
    } else if (!isInitialRender && prevTemp.current !== colorTemperatureK) {
      setBulbColorObj(resolveColorFromTemp(colorTemperatureK))
    }

    prevRgb.current = colorRgb
    prevTemp.current = colorTemperatureK

  }, [colorRgb, colorTemperatureK])

  return (<div>
    <BulbDisplay bulbColor={bulbColorObj} bulbBrightness={brightness} id={id}></BulbDisplay>
    <p>{deviceName}</p>
    <span>online: {online}</span>
  </div>)
}

function BulbDisplay({bulbColor, bulbBrightness, id} : {bulbColor : string | null, bulbBrightness : number, id : string}) {
  return (<div
    className='w-[200px] h-[200px] rounded-full'
    style={{ 
      // backgroundColor: bulbColor ? bulbColor : "rgb(0, 0, 0)", 
      opacity: bulbBrightness / 100
      }}> 
      <BulbSvg fillColor={ bulbColor ? bulbColor : "rgb(0, 0, 0)"} id={id}></BulbSvg>
  </div>)
}
