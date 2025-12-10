'use client'
import React, { useState, useEffect } from "react";
import { sendControlRequest } from "@/app/components/Device";
import ColorControl from "@/app/components/controls/ColorControl";
import BrightnessControl from "@/app/components/controls/BrightnessControl";
import PowerControl from "@/app/components/controls/PowerControl";
import TemperatureControl from "@/app/components/controls/TemperatureControl";

export default function GroupControls({ selected, devices, updateUIS }) {
  // selected: array of device IDs
  // devices: full device list
  // updateUIS: function that can update multiple device UI states

  const selectedDevices = devices.filter((d) => selected.includes(d.device));
  const sharedCapabilities = getSharedCapabilities(selectedDevices)

  // One shared state for group control UIs
  const [groupState, setGroupState] = useState({
    colorValue: null,
    brightnessValue: null,
    switchState: null,
    tempValue: null,
  });

  // Handle a UI change from any group control component
  function handleGroupUpdate(partial) {
    setGroupState((prev) => ({ ...prev, ...partial }));
  }

  useEffect(() => {
    console.log(groupState)
  })

  // Send batch API + update each UI
  async function applyBatch() {
    for (const dev of selectedDevices) {
      const updates = {};

      if (groupState.colorValue !== null) {
        updates.colorValue = groupState.colorValue;
      }

      if (groupState.brightnessValue !== null) {
        updates.brightnessValue = groupState.brightnessValue;
      }

      if (groupState.switchState !== null) {
        updates.switchState = groupState.switchState;
      }

      if (groupState.tempValue !== null) {
        updates.colorValue = groupState.tempValue;
      }

      updateUIS(dev.device, updates);
    }
  }

  if (selectedDevices.length === 0) {
    return <p>No devices selected.</p>;
  }

  return (
    <div className="p-4 border rounded-xl mt-4">
      <h2 className="font-bold mb-2">Group Controls ({selectedDevices.length} devices)</h2>

      {sharedCapabilities.map((cap) => {
        const Control = getControlComponent(cap)
        if (!Control) return null

        // 3️⃣ Group onChange: send request to ALL devices
        function handleGroupChange(updateObj) {
        // Derive raw numerical value
        let rawValue = Object.values(updateObj)[0];

        // 1. Update group UI state
        handleGroupUpdate(updateObj);

        // 2. Apply UI update to all selected devices immediately
        selectedDevices.forEach(dev => updateUIS(dev.device, updateObj));

        // 3. Send API request for all selected devices
        selectedDevices.forEach(dev => {
          sendControlRequest(
            dev.device,
            dev.sku,
            cap.instance,
            cap.type,
            rawValue
          );
        });
      }
        return (
          <Control
            key={cap.instance}
            initialValue={cap.defaultValue ?? 0}
            capabilityInstance={cap.instance}
            capabilityType={cap.type}
            device="GROUP"
            sku="GROUP"
            onLocalChange={ handleGroupChange }
          >
            Group {cap.instance}
          </Control>
        )
      })}
    </div>
  );
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
