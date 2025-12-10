'use client'
import React, {useState, useEffect} from 'react'
import BrightnessControl from '@/app/components/controls/BrightnessControl'
import ColorControl from '@/app/components/controls/ColorControl'
import PowerControl from '@/app/components/controls/PowerControl'
import TemperatureControl from '@/app/components/controls/TemperatureControl'
import { DeviceData, Capability, ControlProps } from "../types/device"
import {getTempHexColor} from '@/app/helpers/helpers.js'

function Device({ data, uiState, updateUI, selectionMode, selected, onSelect }) {
  const [capabilityArr, setCapabilityArr] = useState<Capability[] | null>(null);
  
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
    setCapabilityArr(
      res.payload.capabilities
    );
  }

  useEffect(() => {
    getStatus()
  }, [])

  let bulbColor = "#000";
  let bulbBrightness = 100;
  let brightness = 0;
  let online = false;

  if (uiState) {
    const { r, g, b } = uiState.colorValue > 10000 ? getRGBFromNumber(uiState.colorValue) : getTempHexColor(uiState.colorValue);
    bulbColor = `rgb(${r}, ${g}, ${b})`;
    online = uiState.powerState
    bulbBrightness = uiState.brightnessValue; 
  }

  return (
    <div>
      
      {selectionMode && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="device-checkbox"
        ></input>
      )}

      <BulbDisplay bulbColor={bulbColor} bulbBrightness={bulbBrightness} 
      ></BulbDisplay>
      <p>{data.deviceName}</p>
      {
        capabilityArr !== null &&
          <div>
            { "online? " + online}
          </div>
      }
      {!selectionMode && (
        
          <BulbControls data={data} online={online} capabilityArr={capabilityArr} updateUI={updateUI} uiState={uiState}
          // setLocalColor={setLocalColor} setLocalBrightness={setLocalBrightness}
          ></BulbControls>
      )}
    </div>
  )
}

function BulbDisplay({bulbColor, bulbBrightness}) {
  return (<div
    className='bulb w-[100px] h-[100px] rounded-full'
    style={{ 
      backgroundColor: bulbColor, 
      opacity: bulbBrightness / 100
      }}> 
  </div>)
}

function BulbControls({data, online, capabilityArr, updateUI, uiState
  // setLocalColor, setLocalBrightness
}) {
  return (<>
    {capabilityArr && online &&
    capabilityArr.map((item) => {
      const Control = getControlComponent(item);
      if (!Control) return null; 

      const isColor = item.instance === "colorRgb";
      const isTemp = item.instance === "colorTemperatureK";
      const isBrightness = item.instance === "brightness";
      const isPower = item.instance === "powerSwitch";

      let initialValue = null; 
      if (isColor || isTemp) {
        initialValue = uiState.colorValue 
      } else if (isBrightness) {
        initialValue = uiState.brightnessValue
      } else if (isPower) {
        initialValue = uiState.switchState
      } 

      return (
        <Control
          key={item.instance}
          initialValue={initialValue}
          capabilityInstance={item.instance}
          capabilityType={item.type}
          sku={data.sku}
          device={data.device}
          onLocalChange={updateUI}
        >
          control: {item.instance} device: {data.deviceName}
        </Control>
      );
    })
  }
  </>)
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