"use client";

import { useState } from "react";
import { Plus, Target,  Trash2, Copy } from "lucide-react";

interface CustomEvent {
  id: string;
  name: string;
  description: string;
  triggers: number;
}

interface CustomEventsManagerProps {
  pageId: number;
}

export default function CustomEventsManager({ pageId }: CustomEventsManagerProps) {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", description: "" });

  const handleAddEvent = async () => {
    if (!newEvent.name.trim()) return;

    const event: CustomEvent = {
      id: crypto.randomUUID(),
      name: newEvent.name,
      description: newEvent.description,
      triggers: 0,
    };

    setEvents([...events, event]);
    setNewEvent({ name: "", description: "" });
    setShowAddForm(false);

    // Save to database
    try {
      await fetch(`/api/analytics/custom-events/${pageId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Failed to save custom event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    
    try {
      await fetch(`/api/analytics/custom-events/${pageId}/${eventId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete custom event:", error);
    }
  };

  const copyTrackingCode = (eventName: string) => {
    const code = `data-conversion-event="${eventName}"`;
    navigator.clipboard.writeText(code);
    alert(`Tracking code copied! Add ${code} to any element you want to track.`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Custom Conversion Events</h3>
          <p className="text-sm text-gray-600 mt-1">
            Define custom events to track specific user actions
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">New Custom Event</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                placeholder="e.g., download_pdf, sign_up, contact_click"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="What does this event track?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Event
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewEvent({ name: "", description: "" });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      {event.triggers} trigger{event.triggers !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => copyTrackingCode(event.name)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy tracking code
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No custom events yet</p>
          <p className="text-sm mt-1">Create events to track specific user actions</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">How to use:</h4>
        <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
          <li>Create a custom event above</li>
          <li>Copy the tracking code</li>
          <li>Add it to any HTML element in your page blocks (e.g., buttons, links)</li>
          <li>Track conversions when users interact with those elements</li>
        </ol>
      </div>
    </div>
  );
}
