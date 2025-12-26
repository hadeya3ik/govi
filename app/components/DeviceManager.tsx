'use client'
import { motion } from "framer-motion"
import React, {useEffect, useState, useRef} from 'react'
import Device from '@/app/components/Device'
import ControlPanel from '@/app/components/controls/ControlPanel'
import { DeviceData, DeviceUIMap, StatePayload, defaultDeviceState } from "../types/device"

export default function DeviceList({devices, devicesState, updateDeviceUI} : {devices: DeviceData[], devicesState : DeviceUIMap, updateDeviceUI : (deviceId: string, update: any) => void; }) {
  const [index, setIndex] = useState(0)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [isSelectionMode, setSelectionMode] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<Map<number, HTMLElement> | null>(null)

  const deviceEntries = Object.entries(devicesState)

  function getMap(): Map<number, HTMLElement> {
    if (!itemsRef.current) itemsRef.current = new Map()
    return itemsRef.current
  }

  function scrollToIndex(index: number) {
    const node = getMap().get(index)
    if (!node) return

    node.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }

  function handleScroll() {
    if (isSelectionMode) return
    if (!containerRef.current) return

    let closestIndex = index
    let minDistance = Infinity
    const containerRect = containerRef.current.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    getMap().forEach((node: HTMLElement, index: number) => {
      const rect = node.getBoundingClientRect()
      const itemCenter = rect.left + rect.width / 2
      const distance = Math.abs(containerCenter - itemCenter)

      if (distance < minDistance) {
        minDistance = distance
        closestIndex = index
      }
    })
    setIndex(closestIndex)
  }

  function toggleSelectionMode() {
    const next = !isSelectionMode
    if (!next) {
      setIndex(Math.floor(devices.length / 2))
    }
    setSelectedDevices(next ? devices.map(d => d.device) : [devices[index].device])
    scrollToIndex(Math.floor(devices.length / 2))
    setSelectionMode(next)
  }

  useEffect(() => {
    if (devices.length > 0) setSelectedDevices([devices[index].device])
  }, []) 

  useEffect(() => {
    setSelectedDevices([devices[index].device])
  }, [index])

  return (
    <div className="flex flex-col h-full ">
      <div className="flex-1 flex flex-col shrink-0 h-full justify-between items-center device-container ">
        <button className="button-primary" onClick={toggleSelectionMode}>
          {`${isSelectionMode ? "exit" : "enter"} select mode`}
        </button>
        <div className={`devices-list flex flex-row ${isSelectionMode ? "selection-mode" : "default-mode" }`}>
          <div className="wrapper">
          <div
            ref={containerRef}
            className={`cards ${isSelectionMode ? "selection-mode" : ""}`}
            onScroll={handleScroll}
          >
            {deviceEntries.map(([deviceId, deviceState], idx) => (
              <div
                key={deviceId}
                ref={(node) => {
                  const map = getMap()
                  if (node) map.set(idx, node)
                  else map.delete(idx)
                }}
                className={`cursor-pointer select-none card ${idx === index || isSelectionMode ? "active" : "" }`}
                onClick={() => {
                  if (isSelectionMode) {
                    setSelectedDevices(prev =>  prev.includes(deviceId) ? 
                      prev.filter(id => id !== deviceId) : [...prev, deviceId])
                    return
                  }
                  scrollToIndex(idx)
                }}
              >
                <Device
                  id={deviceId}
                  {...deviceState}
                  onUpdate={updateDeviceUI}
                  isSelected={isSelectionMode && selectedDevices.includes(deviceId)}
                />
              </div>
            ))}
            </div>
          </div>
        </div>
        <div className={isSelectionMode ? "invisible" : "visible"}>
          <button className="button-secondary" onClick={() => {setIndex((index - 1 + devices.length) %  devices.length )}}>Prev</button>
          <button className="button-secondary" onClick={() => {setIndex((index + 1) % devices.length)  }}>Next</button>
        </div>
      </div>
      <div className="flex item-center justify-center">
        {Object.keys(devicesState).length !== 0 && (
          <ControlPanel
            id={selectedDevices}
            {...devicesState[devices[index].device]}
            onUpdate={updateDeviceUI}
          />
        )}
      </div>
  </div>)
}