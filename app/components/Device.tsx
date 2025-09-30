'use client'
import React, {useState, useEffect} from 'react'
import BrightnessControl from '@/app/components/controlls/BrightnessControl'
import ColorControl from '@/app/components/controlls/ColorControl'
import PowerControl from '@/app/components/controlls/PowerControl'
import TemperatureControl from '@/app/components/controlls/TemperatureControl'
import { DeviceData, Capability, ControlProps } from "../types/device"

function Device({ data }: { data: DeviceData }) {
  const [capabilityArr, setCapabilityArr] = useState<Capability[] | null>(null);
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
    
    setCapabilityArr(
      res.payload.capabilities.filter(
        (item: Capability) => item.type !== "devices.capabilities.dynamic_scene"
      )
    );
  }
  
  useEffect(() => {
    getStatus()
  }, [])

  console.log("STATUS", capabilityArr)
  
  useEffect(() => {
    capabilityArr !== null ?  setOnline(capabilityArr[0].state?.value) : null
  }, [capabilityArr])

  return (
    <div>
      <h3>{data.deviceName}</h3>
      {
        capabilityArr !== null &&
            <div>
              { "online? " + online}
            </div>
        }
      
      {capabilityArr !== null && online &&
        capabilityArr.map((item) => 
        {  
          const Control = getControlComponent(item) as any;
          console.log("the state is: ", item.state?.value)
          return (
          <Control 
            key={item.instance}
            initialValue={item.state?.value ?? null}
            capabilityInstance={item.instance}
            capabilityType={item.type}
            sku={data.sku}
            device={data.device}>
            control : {item.instance} device : {data.deviceName}
          </Control>)
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
  return Online;
}

function Online({initialValue, capabilityInstance, capabilityType , device, children} : ControlProps) {
  return (
    <div>
      {initialValue ? "Online" : "Offline"}
    </div>
  ) 
}




async function sendControlRequest(
    ID : string,
    sku : string, 
    instance : string, 
    type : string, 
    value : number) 
  {
  console.log("fetch")
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
  
  const jsonData = await req.json()
  console.log(jsonData)
}

export default Device;
export { sendControlRequest };