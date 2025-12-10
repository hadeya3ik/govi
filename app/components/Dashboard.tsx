'use client'
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import { DeviceData, Capability, DeviceUIState, DeviceUIMap } from "../types/device"
import GroupControls from '@/app/components/GroupControls'


function Dashboard({devices} : { devices: DeviceData[] }) {
  const [deviceUI, setDeviceUI] = useState<DeviceUIMap>({});
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  async function setDevices() {
    if (!devices) {
      return 
    }

    for (const device of devices) {
      const request = await fetch("/api/state", {
        body: JSON.stringify({
          sku : device.sku, 
          ID : device.device
        }), 
        headers : {"Content-Type" : "application/json"}, 
        method : "POST"
      })
      const res = await request.json() 
      const cap = res.payload.capabilities as Capability[] 

      const power = cap.find(item => item.instance === "online");
      const switchState = cap.find(item => item.instance === "powerSwitch");
      const brightness = cap.find(item => item.instance === "brightness");
      const color = cap.find(item => item.instance === "colorRgb");
      const temp = cap.find(item => item.instance === "colorTemperatureK");

      device.online = power?.state?.value;
      device.switch = switchState?.state?.value;
      device.brightnessValue = brightness?.state?.value;

      if (color?.state?.value) {
        device.colorValue = color.state.value;
      } else if (temp?.state?.value) {
        device.colorValue = temp.state.value;
      } else {
        device.colorValue = 0;
      }

      setDeviceUI(prev => ({
      ...prev,
      [device.device]: {
        colorValue: device.colorValue,
        brightnessValue: device.brightnessValue,
        powerState: device.online, 
        switchState : device.switch
      }
    }));
    }
  }

  const updateDeviceUI = (deviceId: string, update:any) => {
    setDeviceUI(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        ...update,
      }
    }));
  };

  useEffect(() => {
    setDevices()
    console.log("SET")
  }, [devices])

  useEffect(() => {
    console.log("deviceUI", deviceUI)
  })

  return (
    <>
      <button onClick={() => {
        setSelectionMode(!selectionMode);
         }}>
        {selectionMode ? "Exit Selection Mode" : "Select Bulbs"}
      </button>
      {selectionMode 
      // && selectedDevices.length > 0 
      && devices &&
       (
        <GroupControls
          selected={selectedDevices}
          devices={devices}
          updateUIS={(id, updates) => updateDeviceUI(id, updates)}
        />
      )}
      {deviceUI !== null && devices !== null && devices.map((item) => (
        <Device
        key={item.device}
        data={item}
        uiState={deviceUI[item.device]}
        updateUI={updates => updateDeviceUI(item.device, updates)}
        selectionMode={selectionMode}
        selected={selectedDevices.includes(item.device)}
        onSelect={() => {
          setSelectedDevices(prev =>
              prev.includes(item.device)
                ? prev.filter(id => id !== item.device)
                : [...prev, item.device]
            );
          }}
      />
      ))}
    </>
  )
}

export default Dashboard