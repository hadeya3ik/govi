'use client'
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import ControlPanel from '@/app/components/controls/ControlPanel'
import { DeviceData, DeviceUIMap, StatePayload, defaultDeviceState } from "../types/device"

export default function DeviceList({devices, devicesState, updateDeviceUI} : {devices: DeviceData[], devicesState : DeviceUIMap, updateDeviceUI : (deviceId: string, update: any) => void; }) {
    const [index, setIndex] = useState(0)
    const [isSelectionMode, setSelectionMode] = useState(false)
    const [selectedDevices, setSelectedDevices] = useState<string[]>([])

    useEffect(() => {
      console.log("selectedDevices", selectedDevices)
    }) 

    return (<>
    <div className=''>
      <button 
        onClick={() => {
          setSelectionMode(!isSelectionMode); 
          // setSelectedDevices([devices[index].device])
        }
        }>
        turn {isSelectionMode ? "off" : "on"} selection mode
      </button>
      <div className='flex'>
      {devices && Object.entries(devicesState).map(([deviceId, deviceState], idx) => {
        return (
          <div key={deviceId}>
            <input type='checkbox' 
              checked={
                // isSelectionMode ? 
                selectedDevices.includes(deviceId) 
                // : 
                // deviceId == devices[index].device
                } 
              
                onChange={() => {
                  // isSelectionMode ? 
                    selectedDevices.includes(deviceId) ? 
                      setSelectedDevices(selectedDevices.filter(id => id != deviceId)) 
                      : 
                      setSelectedDevices([...selectedDevices, deviceId]) 
                    // : 
                    // setIndex(idx)
                  }
                  }
            ></input>
            <Device id={deviceId} {...deviceState} onUpdate={updateDeviceUI}></Device>
          </div>
        )
      })}
      </div>
      </div>
      {Object.keys(devicesState).length !== 0 && (
        <ControlPanel
          id={selectedDevices}
          {
            ...devicesState[devices[index].device]
          }
          onUpdate={updateDeviceUI}
        />
      )}
  </>)
}