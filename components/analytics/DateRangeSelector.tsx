"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";

interface DateRangeSelectorProps {
  selectedRange: number;
  customStart?: string;
  customEnd?: string;
  onRangeChange: (days: number, customStart?: string, customEnd?: string) => void;
}

export default function DateRangeSelector({
  selectedRange,
  customStart,
  customEnd,
  onRangeChange,
}: DateRangeSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState(customStart || "");
  const [endDate, setEndDate] = useState(customEnd || "");

  const presetRanges = [
    { days: 7, label: "Last 7 days" },
    { days: 30, label: "Last 30 days" },
    { days: 90, label: "Last 90 days" },
  ];

  const handlePresetClick = (days: number) => {
    setShowCustom(false);
    onRangeChange(days);
  };

  const handleCustomApply = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      onRangeChange(diffDays, startDate, endDate);
      setShowCustom(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Calendar className="w-4 h-4 text-gray-600" />
      
      {/* Preset Buttons */}
      <div className="flex items-center gap-2">
        {presetRanges.map((range) => (
          <button
            key={range.days}
            onClick={() => handlePresetClick(range.days)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selectedRange === range.days && !customStart
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {range.label}
          </button>
        ))}
        
        {/* Custom Range Toggle */}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            customStart
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Custom Range
        </button>
      </div>

      {/* Custom Date Picker */}
      {showCustom && (
        <div className="flex items-center gap-2 ml-4 p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || new Date().toISOString().split("T")[0]}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={new Date().toISOString().split("T")[0]}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleCustomApply}
            disabled={!startDate || !endDate}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
          
          <button
            onClick={() => setShowCustom(false)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
