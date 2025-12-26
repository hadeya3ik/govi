'use client'
import React, {useEffect, useState} from 'react'
import { DeviceData, DeviceUIMap, StatePayload, defaultDeviceState } from "../types/device"
import DeviceManager from './DeviceManager'

function Dashboard({devices} : { devices: DeviceData[] }) {
  const [devicesState, setDevicesState] = useState<DeviceUIMap>({});
  const [loading, setLoading] = useState(false)

  async function initializeDevice() {
    setLoading(true)
    const currentDeviceState = await Promise.all(
      devices
      .map((device) => 
        fetch("/api/state", {
          body: JSON.stringify({
            sku : device.sku, 
            ID : device.device
          }), 
          headers : {"Content-Type" : "application/json"}, 
          method : "POST"
        })
        .then((response) => response.json())
      )
    ) as StatePayload[];
    console.log("currentDeviceState", currentDeviceState)

    const newState: DeviceUIMap = {}; 
    
    currentDeviceState.forEach((response, index) => {
      const device = devices[index];

      const capabilityStateMap = Object.fromEntries(
        response.payload.capabilities
          .map(option => [
            option.instance,
            option.state?.value
          ])
      );

      newState[device.device] = {
        ...defaultDeviceState,
        ...device,
        ...capabilityStateMap
      } 
    })
    setDevicesState(newState);
    console.log([devices[0].device])
    setLoading(false)
  }

  const updateDeviceUI = (deviceId: string, update:any) => {
    setDevicesState(prev => ({
    ...prev,
    [deviceId]: {
      ...prev[deviceId],
      ...update,
    },
    }));
  };

  useEffect(() => {
    initializeDevice()
  }, [])

  return (
    <div className='h-full'>
      {loading ? 
        <p>initializing...</p> : 
        <DeviceManager devices={devices} devicesState={devicesState} updateDeviceUI={updateDeviceUI}> 
        </DeviceManager>
      }
    </div>
  )
}

export default Dashboard