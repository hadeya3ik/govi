'use client'
import React from "react"
import BrightnessControl from '@/app/components/controls/BrightnessControl'
import ColorControl from '@/app/components/controls/ColorControl'
import PowerControl from '@/app/components/controls/PowerControl'
import TemperatureControl from '@/app/components/controls/TemperatureControl'
import { Capability, DeviceData } from "../types/device"
import { sendControlRequest } from '@/app/components/Device'

export default function GroupControls({ devices, selected, onRefresh }) {
  const selectedDevices = devices.filter(d => selected.includes(d.device))

  const sharedCapabilities = getSharedCapabilities(selectedDevices)

  return (
    <div style={{ border: "1px solid white", padding: "1rem", marginTop: "1rem" }}>
      <h3>Group Controls ({selectedDevices.length} bulbs)</h3>

      {sharedCapabilities.map((cap) => {
        const Control = getControlComponent(cap)
        if (!Control) return null

        // 3️⃣ Group onChange: send request to ALL devices
        function handleGroupChange(value: number) {
          selectedDevices.forEach(device => {
            sendControlRequest(
              device.device,
              device.sku,
              cap.instance,
              cap.type,
              value
            )
          })
          onRefresh();
        }

        return (
          <Control
            key={cap.instance}
            initialValue={cap.defaultValue ?? 0}
            capabilityInstance={cap.instance}
            capabilityType={cap.type}
            device="GROUP"
            sku="GROUP"
            onLocalChange={handleGroupChange}
          >
            Group {cap.instance}
          </Control>
        )
      })}
    </div>
  )
}

function getSharedCapabilities(selectedDevices: DeviceData[]) {
  if (selectedDevices.length === 0) return []

  // list of all capability arrays
  const caps = selectedDevices.map(d => d.capabilities)

  // start with the first device’s capabilities
  let shared = caps[0]

  // keep only ones found in ALL devices
  shared = shared.filter(cap =>
    caps.every(deviceCaps =>
      deviceCaps.some(dc => dc.instance === cap.instance)
    )
  )

  return shared
}

function getControlComponent(item: Capability) {
  if (item.instance === "powerSwitch") return PowerControl
  if (item.instance === "brightness") return BrightnessControl
  if (item.instance === "colorTemperatureK") return TemperatureControl
  if (item.instance === "colorRgb") return ColorControl
  return null
}
