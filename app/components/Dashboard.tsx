'use client'
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import { DeviceData, DeviceUIMap, StatePayload, defaultDeviceState } from "../types/device"

function Dashboard({devices} : { devices: DeviceData[] }) {
  const [devicesState, setDevicesState] = useState<DeviceUIMap>({});

  async function initializeDevice() {
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
        }).then((response) => response.json())
      )
    ) as StatePayload[];
    console.log("currentDeviceState", currentDeviceState)

    const newState: DeviceUIMap = {}; 
    
    currentDeviceState.forEach((response, index) => {
      console.log("HERE", response.payload.capabilities)
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
    });

    setDevicesState(newState);
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
    <div>
      { devices && Object.entries(devicesState).map(([deviceId, deviceState]) => {
        return (
          <Device key={deviceId} id={deviceId} {...deviceState} onUpdate={updateDeviceUI}></Device>
        )
      })}
    </div>
  )
}

export default Dashboard