'use client'
import React, {useState} from 'react'
import Device from '@/app/components/Device'
import { DeviceData, Capability } from "../types/device"

function ApiKeyInput({
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

function DevicesDashboard() {
  const [value, setValue] = useState("7caf011b-ffe2-40de-a065-cdb5658b2442")
  const [data, setData] = useState<DeviceData[] | null>(null)

  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const response = await fetch("/api/devices", 
      {
          method : "GET",
          headers : {
              "Content-Type" : "application/json"
          }
      }
    )
    const json = await response.json()
    const devices = json.data as DeviceData[]  
    setData(devices.filter((device) => device.type === "devices.types.light"))
    console.log("DATA", data)
  } 

  const handleChange = ((e : React.ChangeEvent<HTMLInputElement>) =>{
    setValue(e.target.value);
  })

  return (
    <>
      <ApiKeyInput handleChange={handleChange} handleSubmit={handleSubmit} ApiKey={value} ></ApiKeyInput>
      <p>{value}</p>
      {data !== null && data.map((item) => <Device data={item} key={item.device} ></Device>)}
    </>
  )
}

export default DevicesDashboard