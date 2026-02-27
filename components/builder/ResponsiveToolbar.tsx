"use client";

import { DeviceBreakpoint } from "@/types/landing-page";
import { Monitor, Smartphone, Tablet, Eye, Code } from "lucide-react";

interface ResponsiveToolbarProps {
  currentDevice: DeviceBreakpoint;
  onDeviceChange: (device: DeviceBreakpoint) => void;
  onPreviewToggle?: () => void;
  onCodeView?: () => void;
  isPreview?: boolean;
}

const DEVICES: Array<{
  type: DeviceBreakpoint;
  icon: React.ReactNode;
  label: string;
  width: number;
}> = [
  {
    type: "mobile",
    icon: <Smartphone className="w-4 h-4" />,
    label: "Mobile",
    width: 375,
  },
  {
    type: "tablet",
    icon: <Tablet className="w-4 h-4" />,
    label: "Tablet",
    width: 768,
  },
  {
    type: "desktop",
    icon: <Monitor className="w-4 h-4" />,
    label: "Desktop",
    width: 1440,
  },
];

export default function ResponsiveToolbar({
  currentDevice,
  onDeviceChange,
  onPreviewToggle,
  onCodeView,
  isPreview = false,
}: ResponsiveToolbarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      {/* Device Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2">View:</span>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {DEVICES.map((device) => (
            <button
              key={device.type}
              onClick={() => onDeviceChange(device.type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentDevice === device.type
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title={`${device.label} (${device.width}px)`}
            >
              {device.icon}
              <span className="hidden sm:inline">{device.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Width Indicator */}
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
        <span className="font-mono">
          {DEVICES.find((d) => d.type === currentDevice)?.width}px
        </span>
        <span className="text-gray-400">×</span>
        <span className="text-gray-500">Auto height</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onPreviewToggle && (
          <button
            onClick={onPreviewToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isPreview
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{isPreview ? "Exit Preview" : "Preview"}</span>
          </button>
        )}

        {onCodeView && (
          <button
            onClick={onCodeView}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            title="View generated code"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Code</span>
          </button>
        )}
      </div>
    </div>
  );
}
