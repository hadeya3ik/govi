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

  // Send batch API + update each UI
  async function applyBatch() {
    for (const dev of selectedDevices) {
      const updates = {};

      if (groupState.colorValue !== null) {
        await sendControlRequest(
          dev.device,
          dev.sku,
          "colorRgb",
          "devices.capabilities.color_setting",
          groupState.colorValue
        );
        updates.colorValue = groupState.colorValue;
      }

      if (groupState.brightnessValue !== null) {
        await sendControlRequest(
          dev.device,
          dev.sku,
          "brightness",
          "devices.capabilities.range",
          groupState.brightnessValue
        );
        updates.brightnessValue = groupState.brightnessValue;
      }

      if (groupState.switchState !== null) {
        await sendControlRequest(
          dev.device,
          dev.sku,
          "powerSwitch",
          "devices.capabilities.on_off",
          groupState.switchState
        );
        updates.switchState = groupState.switchState;
      }

      if (groupState.tempValue !== null) {
        await sendControlRequest(
          dev.device,
          dev.sku,
          "colorTemperatureK",
          "devices.capabilities.color_setting",
          groupState.tempValue
        );
        updates.colorValue = groupState.tempValue;
      }

      // ❗THIS IS THE IMPORTANT PART
      // updates the UI state for each device from Dashboard
      updateUIS(dev.device, updates);
    }
  }

  if (selectedDevices.length === 0) {
    return <p>No devices selected.</p>;
  }

  return (
    <div className="p-4 border rounded-xl mt-4">
      <h2 className="font-bold mb-2">Group Controls ({selectedDevices.length} devices)</h2>

      {/* Color */}
      <ColorControl
        initialValue={groupState.colorValue ?? 0}
        capabilityInstance="colorRgb"
        capabilityType="devices.capabilities.color_setting"
        device="_group_"
        sku="_group_"
        onLocalChange={(updates) => handleGroupUpdate(updates)}
      />

      {/* Brightness */}
      <BrightnessControl
        initialValue={groupState.brightnessValue ?? 100}
        capabilityInstance="brightness"
        capabilityType="devices.capabilities.range"
        device="_group_"
        sku="_group_"
        onLocalChange={(updates) => handleGroupUpdate(updates)}
      />

      {/* Temperature */}
      <TemperatureControl
        initialValue={groupState.tempValue ?? 3000}
        capabilityInstance="colorTemperatureK"
        capabilityType="devices.capabilities.color_setting"
        device="_group_"
        sku="_group_"
        onLocalChange={(updates) => handleGroupUpdate(updates)}
      />

      {/* Power */}
      <PowerControl
        initialValue={groupState.switchState ?? false}
        capabilityInstance="powerSwitch"
        capabilityType="devices.capabilities.on_off"
        device="_group_"
        sku="_group_"
        onLocalChange={(updates) => handleGroupUpdate(updates)}
      />

      <button
        className="mt-3 p-2 px-4 bg-blue-500 text-white rounded-lg"
        onClick={applyBatch}
      >
        Apply to Selected Devices
      </button>
    </div>
  );
}
