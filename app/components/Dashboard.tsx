'use client'
import React, {useEffect, useState} from 'react'
import Device from '@/app/components/Device'
import { DeviceData, Capability } from "../types/device"
import GroupControls from '@/app/components/GroupControls'


function Dashboard({devices}) {
  const [deviceUI, setDeviceUI] = useState({});

  async function settDevices() {
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

      const powerState = res.payload.capabilities?.find(item => item.instance === "online");
      const switchState = res.payload.capabilities?.find(item => item.instance === "powerSwitch");
      const brightnessState = res.payload.capabilities?.find(item => item.instance === "brightness");
      const colorState = res.payload.capabilities?.find(item => item.instance === "colorRgb");
      const tempState = res.payload.capabilities?.find(item => item.instance === "colorTemperatureK");

      device.colorValue = colorState?.state.value;
      device.brightnessValue = brightnessState?.state.value;
      device.online = powerState?.state.value;
      device.switch = switchState?.state.value;

      if (colorState?.state.value !== 0) {
        device.colorValue = colorState?.state.value;
      } else if (tempState?.state.value !== 0) {
        device.colorValue = tempState?.state.value;
      } else if (device.online) {
        device.online = true;
      } else if (device.switch) {
        device.switch = true;
      }

      if (!device.online) {
        device.colorValue = 0 
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

  const updateDeviceUI = (id, updates) => {
  setDeviceUI(prev => ({
    ...prev,
    [id]: {
      ...prev[id],
      ...updates
    }
  }));
};

  useEffect(() => {
    settDevices()
  }, [devices])

  useEffect(() => {
    console.log("deviceUI", deviceUI)
  })

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

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