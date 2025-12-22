'use client'
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import ControlPanel from '@/app/components/ControlPanel'
import { DeviceData, DeviceUIMap, StatePayload, defaultDeviceState } from "../types/device"


export default function DeviceList({devices, devicesState, updateDeviceUI} : {
    devices: DeviceData[], 
    devicesState : DeviceUIMap, 
    updateDeviceUI : (deviceId: string, update: any) => void; }) 
  {
    const [index, setIndex] = useState(0)
    
    return (<>
    <div className='flex'>
      {devices && Object.entries(devicesState).map(([deviceId, deviceState], idx) => {
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
      {Object.keys(devicesState).length !== 0 && (
        <ControlPanel
          id={devices[index].device}
          {...devicesState[devices[index].device]}
          onUpdate={updateDeviceUI}
        />
      )}
  </>)
}