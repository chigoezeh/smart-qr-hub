"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface Schedule {
  id: string;
  days: number[];
  startTime: string;
  endTime: string;
  url: string;
}

interface ScheduleBuilderProps {
  schedules: Schedule[];
  onChange: (schedules: Schedule[]) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export function ScheduleBuilder({ schedules, onChange }: ScheduleBuilderProps) {
  const addSchedule = () => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      days: [1, 2, 3, 4, 5], // Mon-Fri default
      startTime: "09:00",
      endTime: "17:00",
      url: "",
    };
    onChange([...schedules, newSchedule]);
  };

  const removeSchedule = (id: string) => {
    onChange(schedules.filter((s) => s.id !== id));
  };

  const updateSchedule = (id: string, field: keyof Schedule, value: any) => {
    onChange(
      schedules.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const toggleDay = (scheduleId: string, day: number) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return;

    const newDays = schedule.days.includes(day)
      ? schedule.days.filter((d) => d !== day)
      : [...schedule.days, day].sort();

    updateSchedule(scheduleId, "days", newDays);
  };

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 space-y-4"
        >
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-purple-900">
              Time-Based Rule
            </h4>
            <button
              type="button"
              onClick={() => removeSchedule(schedule.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Active Days
            </label>
            <div className="flex gap-2 flex-wrap">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(schedule.id, day.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    schedule.days.includes(day.value)
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-300 hover:border-purple-400"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={schedule.startTime}
                onChange={(e) =>
                  updateSchedule(schedule.id, "startTime", e.target.value)
                }
                className="w-full rounded-lg border-2 border-purple-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={schedule.endTime}
                onChange={(e) =>
                  updateSchedule(schedule.id, "endTime", e.target.value)
                }
                className="w-full rounded-lg border-2 border-purple-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Destination URL */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Redirect URL for this time period
            </label>
            <input
              type="url"
              value={schedule.url}
              onChange={(e) =>
                updateSchedule(schedule.id, "url", e.target.value)
              }
              placeholder="https://special-hours.com"
              className="w-full rounded-lg border-2 border-purple-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSchedule}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Time Schedule
      </button>
    </div>
  );
}
