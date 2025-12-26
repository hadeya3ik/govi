'use client'
import { useState, useEffect } from "react";
import DevicesDashboard from '@/app/components/Dashboard'
import { ApiDeviceData, DeviceData } from "@/app/types/device"
import ApiKeyForm from '@/app/components/ApiKeyForm'

const REQUIRED_DEVICE_TYPE = "devices.types.light"
const REQUIRED_DEVICE_CAPABILITIES = [
  "devices.capabilities.range",
  "devices.capabilities.on_off",
  "devices.capabilities.color_setting"
];

export default function Home() {
  const [authVersion, setAuthVersion] = useState<number>(0);
  const [devices, setDevices] = useState<DeviceData[]>([]) 
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  async function getDevices() {
    try {
      setLoading(true)
      setError("")
      const response = await fetch("/api/devices", 
        {
          method : "GET",
          headers : {
              "Content-Type" : "application/json"
          }
        }
      )

      if (!response.ok) {
        setError("Error: " + response.status + response.statusText)
        return
      }
      
      const json = await response.json()
      let apiData = json.data as ApiDeviceData[];
      let deviceData = apiData
        // keep only light devices that support required capabilities then omit these fields 
        .filter(device =>
          device.type === REQUIRED_DEVICE_TYPE &&
          REQUIRED_DEVICE_CAPABILITIES.every(required_capability =>
            device.capabilities.some(capability => capability.type === required_capability)
          )
        )
        .map(({ type, capabilities, ...rest }) => rest)
        
      console.log("OG DATA", deviceData)
      setDevices(deviceData)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDevices()
  }, [authVersion])

  return (
    <div className="h-[100%]">
      <ApiKeyForm setAuth={setAuthVersion}></ApiKeyForm>
      {authVersion > 0 && error && <p>{error}</p>}
      {loading && <p>loading...</p>}
      {!error && !loading && authVersion > 0 && <DevicesDashboard devices={devices}></DevicesDashboard>}
    </div>
  )
}