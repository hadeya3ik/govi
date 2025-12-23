'use client'
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import ControlPanel from '@/app/components/controls/ControlPanel'
import { DeviceData, DeviceUIMap, StatePayload, defaultDeviceState } from "../types/device"

export default function DeviceList({devices, devicesState, updateDeviceUI} : {devices: DeviceData[], devicesState : DeviceUIMap, updateDeviceUI : (deviceId: string, update: any) => void; }) {
    const [index, setIndex] = useState(0)
    const [selectedDevices, setSelectedDevices] = useState<string[]>([])
    const isSelectionMode = selectedDevices.length > 1

    useEffect(() => {
      console.log("selectionMode", isSelectionMode)
      console.log("selectedDevices", selectedDevices)
    }) 

    useEffect(() => {
      if (devices.length > 0) {
        setSelectedDevices([devices[index].device])
      }
    }, []) 

    useEffect(() => {
      setSelectedDevices([devices[index].device])
    }, [index])

    return (<>
    <div className=''>
      {isSelectionMode && 
      <>
        <button onClick={() => { setSelectedDevices([devices[index].device])}}>exit</button>
        <button onClick={() => { setSelectedDevices(devices.map((d) => d.device))}}>select All</button>
      </>}
      <div className={`flex flex-row ${isSelectionMode ? "" : "gap-[25%]" }`}>
      {devices && Object.entries(devicesState).map(([deviceId, deviceState], idx) => {
        return (
          <div key={deviceId}>
            <input type='checkbox' 
              checked={selectedDevices.includes(deviceId)} 
              onChange={() => {
                selectedDevices.includes(deviceId) ? 
                  setSelectedDevices(selectedDevices.filter(id => id != deviceId)) : 
                  setSelectedDevices([...selectedDevices, deviceId])}
              }
            ></input>
            <Device id={deviceId} {...deviceState} onUpdate={updateDeviceUI}></Device>
          </div>)
      })}
      </div>
      <div>
        <button onClick={() => {setIndex((index - 1 + devices.length) %  devices.length )}}>Prev</button>
        <button onClick={() => {setIndex((index + 1) % devices.length)  }}>Next</button>
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