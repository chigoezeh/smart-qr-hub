"use client";

import { CalendarBlockContent } from "@/types/landing-page";
import { Plus, Trash2, Calendar, MapPin, ExternalLink } from "lucide-react";

interface CalendarEditorProps {
  content: CalendarBlockContent;
  onChange: (content: CalendarBlockContent) => void;
}

export default function CalendarEditor({ content, onChange }: CalendarEditorProps) {
  const events = content.events || [];

  const addEvent = () => {
    onChange({
      ...content,
      events: [
        ...events,
        {
          title: "",
          date: "",
          time: "",
          location: "",
          description: "",
          registrationUrl: "",
        },
      ],
    });
  };

  const removeEvent = (index: number) => {
    onChange({
      ...content,
      events: events.filter((_, i) => i !== index),
    });
  };

  const updateEvent = (index: number, updates: any) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], ...updates };
    onChange({ ...content, events: newEvents });
  };

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Display Style</label>
        <select
          value={content.view || "list"}
          onChange={(e) => onChange({ ...content, view: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="list">List View</option>
          <option value="calendar">Calendar View</option>
        </select>
      </div>

      {/* Add Event Button */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">Events</label>
        <button
          onClick={addEvent}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Event
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm">No events yet</p>
          <p className="text-xs mt-1">Click "Add Event" to create your first event</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-white space-y-3"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {event.title || `Event ${index + 1}`}
                  </span>
                </div>
                <button
                  onClick={() => removeEvent(index)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Event Title</label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => updateEvent(index, { title: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Event name"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) => updateEvent(index, { date: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Time</label>
                  <input
                    type="time"
                    value={event.time || ""}
                    onChange={(e) => updateEvent(index, { time: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Location
                </label>
                <input
                  type="text"
                  value={event.location || ""}
                  onChange={(e) => updateEvent(index, { location: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Venue name or address"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Description</label>
                <textarea
                  value={event.description || ""}
                  onChange={(e) => updateEvent(index, { description: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Event details..."
                  rows={2}
                />
              </div>

              {/* Registration URL */}
              <div>
                <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Registration/RSVP Link
                </label>
                <input
                  type="url"
                  value={event.registrationUrl || ""}
                  onChange={(e) => updateEvent(index, { registrationUrl: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
