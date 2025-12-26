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

    function toggleSelectionMode() {
      setSelectionMode(prev => {
        const next = !prev
        setSelectedDevices(next ? devices.map(d => d.device) : [devices[index].device])
        return next
      })
    }

    const toggleRight = () => {setIndex((index - 1 + devices.length) %  devices.length )}
    const toggleLeft = () => {setIndex((index + 1) % devices.length)}


    useEffect(() => {
      if (devices.length > 0) {
        setSelectedDevices([devices[index].device])
      }
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
      <Carousel devicesState={devicesState} selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} updateDeviceUI={updateDeviceUI} activeIndex={index} setActiveIndex={setIndex} toggleRight={toggleRight} toggleLeft={toggleLeft} isSelectionMode={isSelectionMode}></Carousel>
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
            {
              ...devicesState[devices[index].device]
            }
            onUpdate={updateDeviceUI}
          />
        )}
      </div>
  </div>)
}

function Carousel({devicesState, selectedDevices, setSelectedDevices, updateDeviceUI, activeIndex, setActiveIndex, toggleRight, toggleLeft, isSelectionMode}) {
  const containerRef = useRef(null);
  const itemsRef = useRef(null);  
  const deviceEntries = Object.entries(devicesState);
  const itemCount = deviceEntries.length;

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  function scrollToIndex(index) {
    const node = getMap().get(index);
    if (!node) return;

    node.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function handleScroll() {
    if (isSelectionMode) return;
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = activeIndex;
    let minDistance = Infinity;

    getMap().forEach((node, index) => {
      const rect = node.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }

  function next() {
  const nextIndex = (activeIndex + 1) % itemCount;
  setActiveIndex(nextIndex);
  scrollToIndex(nextIndex);
}

function prev() {
  const prevIndex = (activeIndex - 1 + itemCount) % itemCount;
  setActiveIndex(prevIndex);
  scrollToIndex(prevIndex);
}

  return (
    <div className="flex flex-col">
    <div className="wrapper">
      <div ref={containerRef} className="cards" onScroll={handleScroll}>
        {deviceEntries.map(([deviceId, deviceState], index)  => (
          <div
            key={deviceId}
            ref={(node) => {
              const map = getMap();
              if (node) map.set(index, node);
              else map.delete(index);
            }}
            className={`card ${index === activeIndex || isSelectionMode ? "active" : ""}`}
            onClick={() => scrollToIndex(index)}
          >
             <div key={deviceId} className="shrink-0">
            <input type='checkbox' 
              checked={selectedDevices.includes(deviceId)} 
              onChange={() => {
                selectedDevices.includes(deviceId) ? 
                  setSelectedDevices(selectedDevices.filter(id => id != deviceId)) : 
                  setSelectedDevices([...selectedDevices, deviceId])}
              }
            ></input>
            <Device id={deviceId} {...deviceState} onUpdate={updateDeviceUI}></Device>
          </div>
          </div>
        ))}
      </div>
      </div >
      {/* <div className={isSelectionMode ? "invisible" : "visible"}>
        <button onClick={prev}>◀</button>
        <button onClick={next}>▶</button>
      </div> */}
      </div>
  );
}
