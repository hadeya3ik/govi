'use client'
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import { DeviceData, Capability } from "../types/device"
import GroupControls from '@/app/components/GroupControls'

function InputForm({
    ApiKey,
    handleChange,
    handleSubmit,
  }: {
    ApiKey: string
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  }) {
  return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="">
          API key: 
          <input type="text" id="ApiKeyInput" value={ApiKey} onChange={handleChange} />
        </label>
        <button type="submit">fetch</button>
    </form>
  )
}

function Dashboard() {
  const [apiKey, setApiKey] = useState("") 
  const [devices, setDevices] = useState<DeviceData[] | null>(null) 
  const [hasCookies, setHasCookies] = useState(false) 
  const [isEditing, setIsEditing] = useState(false); 

  const [deviceUI, setDeviceUI] = useState({});

  async function getDevices() {
    const response = await fetch("/api/devices", 
      {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
      }
    )
    const json = await response.json()
    let data = json.data as DeviceData[]  
    data = data.filter((device) => device.type === "devices.types.light")
    console.log(data)
    console.log(devices)
    setDevices(data.map(deviceDetails => (
      {...deviceDetails,
        colorValue : 9000,
        brightnessValue : 100, 
        online : true, 
        selected : false, 

      }) ))
  }

  async function settDevices() {
    console.log("DEVICES : ")
    if (!devices) {
      return 
    }

    for (const device of devices) {
      const request = await fetch("/api/state", {
        body: JSON.stringify({
          sku : device.sku, 
          ID : device.device
        }), 
        headers : {"Content-Type" : "application/json"}, 
        method : "POST"
      })
      const res = await request.json()
      console.log(res.payload.capabilities)

      const powerState = res.payload.capabilities?.find(item => item.instance === "online");
      const switchState = res.payload.capabilities?.find(item => item.instance === "powerSwitch");
      const brightnessState = res.payload.capabilities?.find(item => item.instance === "brightness");
      const colorState = res.payload.capabilities?.find(item => item.instance === "colorRgb");
      const tempState = res.payload.capabilities?.find(item => item.instance === "colorTemperatureK");

      device.colorValue = colorState?.state.value;
      device.brightnessValue = brightnessState?.state.value;
      device.online = powerState?.state.value;
      device.switch = switchState?.state.value;

      if (colorState?.state.value !== 0) {
        device.colorValue = colorState?.state.value;
      } else if (tempState?.state.value !== 0) {
        device.colorValue = tempState?.state.value;
      } else if (device.online) {
        device.online = true;
      } else if (device.switch) {
        device.switch = true;
      }

      if (!device.online) {
        device.colorValue = 0 
      }

      console.log("attempting to set deviceUI")
      console.log(device.device, device.colorValue,)

      setDeviceUI(prev => ({
      ...prev,
      [device.device]: {
        colorValue: device.colorValue,
        brightnessValue: device.brightnessValue,
        powerState: device.online, 
        switchState : device.switch
      }
    }));
    }
    
    console.log("DEVICES : ")
    console.log(devices)

  }

  const updateDeviceUI = (id, updates) => {
  setDeviceUI(prev => ({
    ...prev,
    [id]: {
      ...prev[id],
      ...updates
    }
  }));
};

  async function getCookies() {
    const request = await fetch("/api/get-key")
    const json = await request.json()
    if (json.api_key !== null) {
      setHasCookies(true)
      getDevices()
    }
  }

  async function setCookies(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const request = await fetch("/api/set-key", {
      method : "POST",
      body : JSON.stringify({
        api_key : apiKey
      }),
      headers : {
        "Content-Type" : "application/json",
      }
    }) 

    setHasCookies(true)
    setIsEditing(false)
    const json = await request.json()
    if (json.success === true) {
      getDevices()
    } else {
      // ERROR api - key is not valid
    }
  }

  useEffect(() => {
    getCookies()
  }, [])

  useEffect(() => {
    console.log("deviceUI", deviceUI)
    devices?.forEach(item => {
      console.log(deviceUI[item.device])
    }) 
  }, [deviceUI])

  useEffect(() => {
    settDevices()
  }, [devices])

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  return (
    <>
        { hasCookies ?  
        <>
          <button onClick={() => setIsEditing(!isEditing)}>
            change API key?
          </button>
          { isEditing && <InputForm ApiKey={apiKey} handleChange={(e) => {setApiKey(e.target.value)}} handleSubmit={setCookies} ></InputForm> }
          </>
          : 
          <div> 
            <p>hmm.. looks like you dont have your api key set</p>
            <InputForm ApiKey={apiKey} handleChange={(e) => {setApiKey(e.target.value)}} handleSubmit={setCookies} ></InputForm>
          </div>
        }
      <button onClick={() => {
        setSelectionMode(!selectionMode);
        console.log("SELECTION MODE: ", selectionMode)
        // if (!selectionMode) setSelectedDevices([]);
         }}>
        {selectionMode ? "Exit Selection Mode" : "Select Bulbs"}
      </button>
      {selectionMode 
      // && selectedDevices.length > 0 
      && devices &&
       (
        <GroupControls
          selected={selectedDevices}
          devices={devices}
          updateUIS={(id, updates) => updateDeviceUI(id, updates)}
        />
      )}
      {deviceUI !== null && devices !== null && devices.map((item) => (
        <Device
        key={item.device}
        data={item}
        uiState={deviceUI[item.device]}
        updateUI={updates => updateDeviceUI(item.device, updates)}
        selectionMode={selectionMode}
        selected={selectedDevices.includes(item.device)}
        onSelect={() => {
          setSelectedDevices(prev =>
              prev.includes(item.device)
                ? prev.filter(id => id !== item.device)
                : [...prev, item.device]
            );
          }}
      />
      ))}
    </>
  )
}

export default Dashboard