'use client'
import React, {useState, useEffect} from 'react'
import BrightnessControl from '@/app/components/controls/BrightnessControl'
import ColorControl from '@/app/components/controls/ColorControl'
import PowerControl from '@/app/components/controls/PowerControl'
import TemperatureControl from '@/app/components/controls/TemperatureControl'
import { DeviceData, Capability, ControlProps } from "../types/device"
import {getTempHexColor} from '@/app/helpers/helpers.js'

function Device({ data }: { data: DeviceData }) {
  const [capabilityArr, setCapabilityArr] = useState<Capability[] | null>(null);
  const [localColor, setLocalColor] = useState<number | null>(null);
  const [localBrightness, setLocalBrightness] = useState(100);
  const [online, setOnline] = useState(false);
  
  async function getStatus() {
    const request = await fetch("/api/state", {
      body: JSON.stringify({
        sku : data.sku, 
        ID : data.device
      }), 
      headers : {"Content-Type" : "application/json"}, 
      method : "POST"
    })

    const res = await request.json()  

    const power = res.payload.capabilities?.find(c => c.instance === "online");
    if (!power?.state?.value) {
      setOnline(false);
      setLocalColor(null);
      return;
    }    
    ["colorRgb", "colorTemperatureK"].forEach(instance => {
      const cap = res.payload.capabilities?.find(c => c.instance === instance);
      if (cap?.state?.value !== 0) {
        setLocalColor(cap.state.value);
      }
    });

    const cap = res.payload.capabilities?.find(c => c.instance === "brightness");
    if (cap?.state?.value !== 0) {
      setLocalBrightness(cap.state.value);
    }

    setCapabilityArr(
      res.payload.capabilities
    );
  }
  
  useEffect(() => {
    getStatus()
  }, [])
  
  useEffect(() => {
    capabilityArr !== null ?  setOnline(capabilityArr[0].state?.value) : null
    console.log("capabilityArr", data.deviceName, capabilityArr)
    console.log("localColor", localColor)
  }, [capabilityArr])


  let bulbColor = "#000";

  if (localColor !== null) {
    const { r, g, b } = localColor > 10000 ? getRGBFromNumber(localColor) : getTempHexColor(localColor);
    bulbColor = `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <div>
      <div
      className='bulb w-[100px] h-[100px] rounded-full'
      style={{ 
        backgroundColor: bulbColor, 
        opacity: localBrightness / 100
       }}> 
      </div>
      <p>{data.deviceName}</p>
      {
        capabilityArr !== null &&
          <div>
            { "online? " + online}
          </div>
      }
      {capabilityArr && online &&
        capabilityArr.map((item) => {
          const Control = getControlComponent(item);
          if (!Control) return null; 

          const isColor = item.instance === "colorRgb";
          const isTemp = item.instance === "colorTemperatureK";
          const isBrightness = item.instance === "brightness";

          const initialValue =
            isColor ? localColor : item.state?.value ?? null;

          const onChange =
            isColor || isTemp ? setLocalColor : ( isBrightness ? setLocalBrightness : undefined);

          return (
            <Control
              key={item.instance}
              initialValue={initialValue}
              capabilityInstance={item.instance}
              capabilityType={item.type}
              sku={data.sku}
              device={data.device}
              onLocalChange={onChange}
            >
              control: {item.instance} device: {data.deviceName}
            </Control>
          );
        })
      }

    </div>
  )
}

 function getControlComponent(item: Capability) {
  if (item.instance === "powerSwitch") {
    return PowerControl;
  }
  if (item.instance === "brightness") {
    return BrightnessControl;
  }
  if (item.instance === "colorTemperatureK") {
    return TemperatureControl;
  }
  if (item.instance === "colorRgb") {
    return ColorControl;
  }
  return null;
}

function getRGBFromNumber(number : number) {
  const r = (number >> 16) & 0xFF;
  const g = (number >> 8) & 0xFF;
  const b = number & 0xFF;
  return { r, g, b };
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