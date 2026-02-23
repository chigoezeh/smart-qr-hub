"use client";

import { Lock, Calendar, Hash, MapPin, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SecuritySettingsProps {
  isPasswordProtected: boolean;
  setIsPasswordProtected: (value: boolean) => void;
  password: string;
  setPassword: (value: string) => void;
  expiresAt: string;
  setExpiresAt: (value: string) => void;
  maxScans: string;
  setMaxScans: (value: string) => void;
  geofence: {
    enabled: boolean;
    latitude: string;
    longitude: string;
    radiusKm: string;
  };
  setGeofence: (value: any) => void;
}

export default function SecuritySettings({
  isPasswordProtected,
  setIsPasswordProtected,
  password,
  setPassword,
  expiresAt,
  setExpiresAt,
  maxScans,
  setMaxScans,
  geofence,
  setGeofence,
}: SecuritySettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 flex items-center justify-between hover:from-red-100 hover:via-orange-100 hover:to-red-100 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Security & Access Control
            </h3>
            <p className="text-sm text-gray-600">
              Password, expiration, limits & geofencing
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Password Protection */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isPasswordProtected}
                onChange={(e) => setIsPasswordProtected(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                <span className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                  Password Protection
                </span>
              </div>
            </label>

            {isPasswordProtected && (
              <div className="ml-8 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password (users must enter this to access)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                  placeholder="Enter secure password"
                  required={isPasswordProtected}
                />
                <p className="text-xs text-gray-500">
                  ⚡ Users will be prompted for this password before accessing the QR content
                </p>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-200" />

          {/* Expiration Date */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-gray-900">Expiration Date (Optional)</span>
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
            />
            <p className="text-xs text-gray-500">
              🕐 QR code will become inactive after this date/time
            </p>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Scan Limit */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-900">Maximum Scans (Optional)</span>
            </label>
            <input
              type="number"
              min="1"
              value={maxScans}
              onChange={(e) => setMaxScans(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
              placeholder="e.g., 1000"
            />
            <p className="text-xs text-gray-500">
              🎯 QR code will stop working after reaching this scan count
            </p>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Geofencing */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={geofence.enabled}
                onChange={(e) =>
                  setGeofence({ ...geofence, enabled: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  Geofencing (Location-Based Access)
                </span>
              </div>
            </label>

            {geofence.enabled && (
              <div className="ml-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={geofence.latitude}
                      onChange={(e) =>
                        setGeofence({ ...geofence, latitude: e.target.value })
                      }
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      placeholder="37.7749"
                      required={geofence.enabled}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={geofence.longitude}
                      onChange={(e) =>
                        setGeofence({ ...geofence, longitude: e.target.value })
                      }
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      placeholder="-122.4194"
                      required={geofence.enabled}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radius (kilometers)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={geofence.radiusKm}
                    onChange={(e) =>
                      setGeofence({ ...geofence, radiusKm: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="5"
                    required={geofence.enabled}
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    📍 <strong>Tip:</strong> Use Google Maps to find coordinates. Right-click any location → "What's here?"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Security Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Active Security Features:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {isPasswordProtected && <li>✓ Password protection enabled</li>}
                  {expiresAt && <li>✓ Expiration date set</li>}
                  {maxScans && <li>✓ Scan limit configured</li>}
                  {geofence.enabled && <li>✓ Geofencing active</li>}
                  {!isPasswordProtected && !expiresAt && !maxScans && !geofence.enabled && (
                    <li className="text-gray-500">No security features enabled</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
