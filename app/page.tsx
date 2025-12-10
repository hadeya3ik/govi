'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import DevicesDashboard from '@/app/components/Dashboard'
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

export default function Home() {
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
  return (
    <div>
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
      <DevicesDashboard devices={devices}></DevicesDashboard>
    </div>
  );
}
