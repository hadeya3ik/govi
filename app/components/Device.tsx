'use client'
import React, {useState, useEffect} from 'react'

async function handleClick(ID, value, instance, type) {
  console.log("fetch")
  const req = await fetch("/api/control", 
    {
      method : "POST",
      body : JSON.stringify({
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

function Device({data}) {
  const [status, setStatus] = useState([]);

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

    const filtered = res.payload.capabilities.filter(
      (item) => item.type !== "devices.capabilities.dynamic_scene"  
    )
    
    setStatus({
      ...res,
      payload: {
        ...res.payload,
        capabilities: filtered
      }
    })
  }
  
  useEffect(() => {
    getStatus()
  }, [])

  console.log(data)
  return (
    <div>
      <h3>{data.deviceName}</h3>
      {
        status.length !== 0 &&
        status.payload.capabilities.map((item) => 
        {  
          const Control = getControlComponent(item);
          return (<Control key={item.instance}  init={item.state.value} data={data}>
            control : {item.instance} 
          </Control>)}
        )
      }
    </div>
  )
}

function getControlComponent({ type, instance }) {
  console.log("type", type)
  if (instance === "powerSwitch") {
    return ToggleButton;
  }
  if (instance === "brightness") {
    return BrightnessButton;
  }
  if (instance === "colorTemperatureK") {
    return TemperatureButton;
  }
  if (instance === "colorRgb") {
    return ColorButton;
  }
  return Online;
}

function Online({init, data, children}) {

  return (
    <div>
      {init ? "Online" : "Offline"}
    </div>
  ) 
}


function ToggleButton({data, children}) {
  const [lightSwitch, setLightSwitch] = useState(false)
  const instance = "powerSwitch";
  const type = "devices.capabilities.on_off";

  return (
    <div>
      <button onClick={() => {
        handleClick(data.device, lightSwitch ? 0 : 1, instance, type); 
        setLightSwitch(!lightSwitch);}}>{children}</button>
    </div>
  ) 
}

function TemperatureButton({data, children}) {
  const [lightSwitch, setLightSwitch] = useState(false)
  const instance = "colorTemperatureK"
  const type = "devices.capabilities.color_setting"
  
  return (
    <div>
      <button onClick={() => {
        handleClick(data.device, lightSwitch ? 2000 : 7000, instance, type); 
        setLightSwitch(!lightSwitch);}}>{children}</button>
    </div>
  ) 
}

function BrightnessButton({data, children}) {
  const [lightSwitch, setLightSwitch] = useState(false)
  const instance = "brightness"
  const type = "devices.capabilities.range"
  
  return (
    <div>
      <button onClick={() => {
        handleClick(data.device, lightSwitch ? 1 : 100, instance, type); 
        setLightSwitch(!lightSwitch);}}>{children}</button>
    </div>
  )
}

function ColorButton({data, children}) {
  const [lightSwitch, setLightSwitch] = useState(false)
  const instance = "colorRgb"
  const type = "devices.capabilities.color_setting"
  
  return (
    <div>
      <button onClick={() => {
        handleClick(data.device, lightSwitch ? 16761035 : 255, instance, type); 
        setLightSwitch(!lightSwitch);}}>{children}</button>
    </div>
  ) 
}


export default Device
