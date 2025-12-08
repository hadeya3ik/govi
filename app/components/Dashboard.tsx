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
    const data = json.data as DeviceData[]  
    setDevices(data.filter((device) => device.type === "devices.types.light"))
  }

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

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [deviceUI, setDeviceUI] = useState({});

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
      &&
       (
        <GroupControls selected={selectedDevices} devices={devices} />
      )}
      {devices !== null && devices.map((item) => (
        <Device
          data={item}
          selectionMode={selectionMode}
          selected={selectedDevices.includes(item.device)}
          onSelect={() => {
            setSelectedDevices(prev => {
              if (prev.includes(item.device)) {
                return prev.filter(id => id !== item.device);
              } else {
                return [...prev, item.device];
              }
            });
          }}
          key={item.device}
        />
      ))}
    </>
  )
}

export default Dashboard