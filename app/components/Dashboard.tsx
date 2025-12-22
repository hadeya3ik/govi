'use client'
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import ControlPanel from '@/app/components/ControlPanel'
import { DeviceData, DeviceUIMap, StatePayload, defaultDeviceState } from "../types/device"

function Dashboard({devices} : { devices: DeviceData[] }) {
  const [devicesState, setDevicesState] = useState<DeviceUIMap>({});
  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(0)

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
    <div>
      {loading && <p>initializing...</p>}
      <div className='flex'>
      {!loading && devices && Object.entries(devicesState).map(([deviceId, deviceState], idx) => {
        return (
          <div key={deviceId}>
            <input type='checkbox' 
              checked={deviceId == devices[index].device} 
              onChange={() => {setIndex(idx)}}
            ></input>
            <Device id={deviceId} {...deviceState} onUpdate={updateDeviceUI}></Device>
          </div>
        )
      })}
      </div>
      {!loading && Object.keys(devicesState).length !== 0 && (
        <ControlPanel
          id={devices[index].device}
          {...devicesState[devices[index].device]}
          onUpdate={updateDeviceUI}
        />
      )}
    </div>
  )
}

export default Dashboard