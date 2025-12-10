'use client'
import React, { useState, useEffect } from "react";
import { sendControlRequest } from "@/app/components/Device";
import ColorControl from "@/app/components/controls/ColorControl";
import BrightnessControl from "@/app/components/controls/BrightnessControl";
import PowerControl from "@/app/components/controls/PowerControl";
import TemperatureControl from "@/app/components/controls/TemperatureControl";
import { DeviceData, Capability, DeviceUIState, GroupState} from "../types/device"

export default function GroupControls({ 
  selected, devices, updateUIS 
  }: {
    selected : string[];
    devices : DeviceData[];
    updateUIS : (id: string, updates: GroupState) => void;
  }) {

  const selectedDevices = devices.filter((d) => selected.includes(d.device));
  const sharedCapabilities = getSharedCapabilities(selectedDevices)

  const [groupState, setGroupState] = useState<GroupState>({
    colorValue: null,
    brightnessValue: null,
    switchState: null,
  });

  function handleGroupUpdate(partial : GroupState) {
    setGroupState((prev) => ({ ...prev, ...partial }));
  }

  useEffect(() => {
    console.log(groupState)
  })

  async function applyBatch() {
    for (const dev of selectedDevices) {
      const updates = {} as GroupState;

      if (groupState.colorValue !== null) {
        updates.colorValue = groupState.colorValue;
      } else if (groupState.brightnessValue !== null) {
        updates.brightnessValue = groupState.brightnessValue;
      } else if (groupState.switchState !== null) {
        updates.switchState = groupState.switchState;
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

        function handleGroupChange(updateObj : GroupState) {
          let rawValue = Object.values(updateObj)[0];
          handleGroupUpdate(updateObj);
          selectedDevices.forEach(dev => updateUIS(dev.device, updateObj));

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
            initialValue={cap.state?.value ?? 0}
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
  const caps = selectedDevices.map(d => d.capabilities)
  let shared = caps[0]
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
