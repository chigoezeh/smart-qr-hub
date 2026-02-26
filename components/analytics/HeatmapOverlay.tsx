"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ClickPosition {
  x: number;
  y: number;
  count: number;
}

interface HeatmapOverlayProps {
  pageId: number;
  days?: number;
}

export default function HeatmapOverlay({ pageId, days = 30 }: HeatmapOverlayProps) {
  const [enabled, setEnabled] = useState(false);
  const [clicks, setClicks] = useState<ClickPosition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fetchHeatmapData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics/heatmap/${pageId}?days=${days}`);
        if (response.ok) {
          const data = await response.json();
          setClicks(data.clicks || []);
        }
      } catch (error) {
        console.error("Failed to fetch heatmap data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [enabled, pageId, days]);

  if (!enabled) {
    return (
      <button
        onClick={() => setEnabled(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Show Heatmap
      </button>
    );
  }

  const getHeatColor = (count: number, maxCount: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.8) return "rgba(220, 38, 38, 0.8)"; // red-600
    if (intensity > 0.6) return "rgba(249, 115, 22, 0.7)"; // orange-600
    if (intensity > 0.4) return "rgba(234, 179, 8, 0.6)"; // yellow-600
    if (intensity > 0.2) return "rgba(34, 197, 94, 0.5)"; // green-600
    return "rgba(59, 130, 246, 0.4)"; // blue-600
  };

  const maxCount = Math.max(...clicks.map((c) => c.count), 1);

  return (
    <>
      {/* Heatmap Overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div className="relative w-full h-full">
          {clicks.map((click, idx) => (
            <div
              key={idx}
              className="absolute rounded-full blur-xl animate-pulse"
              style={{
                left: `${click.x * 100}%`,
                top: `${click.y * 100}%`,
                width: "120px",
                height: "120px",
                backgroundColor: getHeatColor(click.count, maxCount),
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Click Heatmap</h3>
          <button
            onClick={() => setEnabled(false)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-gray-500">Loading heatmap data...</p>
        ) : (
          <>
            <p className="text-xs text-gray-600">
              Showing {clicks.length} click{clicks.length !== 1 ? "s" : ""} hotspots
            </p>

            {/* Legend */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Intensity:</p>
              <div className="flex items-center gap-1">
                <div className="w-8 h-3 rounded" style={{ backgroundColor: "rgba(59, 130, 246, 0.4)" }} />
                <span className="text-xs text-gray-600">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-3 rounded" style={{ backgroundColor: "rgba(234, 179, 8, 0.6)" }} />
                <span className="text-xs text-gray-600">Med</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-3 rounded" style={{ backgroundColor: "rgba(220, 38, 38, 0.8)" }} />
                <span className="text-xs text-gray-600">High</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
