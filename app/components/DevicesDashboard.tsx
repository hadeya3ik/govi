'use client'
import React, {useEffect, useState} from 'react'
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
  const [value, setValue] = useState("")
  const [data, setData] = useState<DeviceData[] | null>(null)
  const [cookies, setCookie] = useState(false)

  async function getDevices() {
    console.log("requesting w ", value)
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

  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // setCookies()
    // getDevices()
  } 

  async function getCookies() {
    const request = await fetch("/api/get-key")
    const json = await request.json()
    console.log(json.api_key)
    if (json.api_key !== null) {
      // setValue(json.api_key)
      getDevices()
    }
  }

  async function setCookies(e) {
    e.preventDefault()
    console.log("attempting to set cookie")
    const request = await fetch("/api/set-key", {
      method : "POST",
      body : JSON.stringify({
        api_key : value
      }),
      headers : {
        "Content-Type" : "application/json",
      }
    }) 

    const json = await request.json()
    console.log(json)
    if (json.success === true) {
      getDevices()
    }
  }

  useEffect(() => {
    console.log("data", data)
  })

  // useEffect(() => {
  //   getCookies()
  // }, [])

  useEffect(() => {
    console.log(value)
  })

  return (
    <>
      {(! cookies) && <p>hmm.. looks like you dont have your api key set</p>}
      <ApiKeyInput handleChange={(e) => {setValue(e.target.value)}} handleSubmit={setCookies} ApiKey={value} ></ApiKeyInput>
      <p>{value}</p>
      {data !== null && data.map((item) => <Device data={item} key={item.device} ></Device>)}
    </>
  )
}

export default DevicesDashboard