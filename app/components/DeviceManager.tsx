'use client'
import { motion } from "framer-motion"
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import ControlPanel from '@/app/components/controls/ControlPanel'
import { DeviceData, DeviceUIMap, StatePayload, defaultDeviceState } from "../types/device"

export default function DeviceList({devices, devicesState, updateDeviceUI} : {devices: DeviceData[], devicesState : DeviceUIMap, updateDeviceUI : (deviceId: string, update: any) => void; }) {
    const [index, setIndex] = useState(0)
    const [selectedDevices, setSelectedDevices] = useState<string[]>([])
    const [isSelectionMode, setSelectionMode] = useState(false)

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
    <div className="overflow-hidden w-full px-[25%]">
      <button onClick={() => {setSelectionMode(true); setSelectedDevices(devices.map((d) => d.device))}}>set selection mode</button>
      {isSelectionMode && 
      <>
        <button onClick={() => { setSelectedDevices([devices[index].device]); setSelectionMode(false) }}>exit</button>
      </>}
      <motion.div 
        className={`flex flex-row ${isSelectionMode ? "gap-[16px]" : "gap-[25%]" }`}
        animate={{ x: `-${index * 25}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
      {devices && Object.entries(devicesState).map(([deviceId, deviceState], idx) => {
        return (
          <div key={deviceId} className="shrink-0">
            <input type='checkbox' 
              checked={selectedDevices.includes(deviceId)} 
              onChange={() => {
                selectedDevices.includes(deviceId) ? 
                  setSelectedDevices(selectedDevices.filter(id => id != deviceId)) : 
                  setSelectedDevices([...selectedDevices, deviceId])}
              }
            ></input>
            {/* <motion.div
              animate={{
                scale: deviceId === devices[index].device ? 1 : 0.8,
                opacity: deviceId === devices[index].device ? 1 : 0.6,
              }}
              transition={{ duration: 0.3 }}
            > */}
            <Device id={deviceId} {...deviceState} onUpdate={updateDeviceUI}></Device>
            {/* </motion.div> */}
          </div>)
      })}
      </motion.div>
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