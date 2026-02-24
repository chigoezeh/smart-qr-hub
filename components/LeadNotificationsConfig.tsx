"use client";

import { useState } from "react";
import { Mail, Bell, Settings, Plus, Trash2, Check, AlertCircle } from "lucide-react";

interface EmailNotification {
  id: string;
  name: string;
  toEmail: string;
  subject: string;
  enabled: boolean;
  triggerEvent: "form_submit" | "lead_capture" | "any_interaction";
}

interface LeadNotificationConfigProps {
  pageId: number;
}

export default function LeadNotificationsConfig({ pageId }: LeadNotificationConfigProps) {
  const [notifications, setNotifications] = useState<EmailNotification[]>([
    {
      id: "default",
      name: "New Lead Alert",
      toEmail: "you@example.com",
      subject: "New lead from your landing page",
      enabled: true,
      triggerEvent: "form_submit",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<EmailNotification>>({
    name: "",
    toEmail: "",
    subject: "New lead from landing page",
    triggerEvent: "form_submit",
    enabled: true,
  });

  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [emailService, setEmailService] = useState<"resend" | "sendgrid" | "webhook">("resend");

  const handleAddNotification = () => {
    if (!newNotification.toEmail || !newNotification.subject) return;

    const notification: EmailNotification = {
      id: crypto.randomUUID(),
      name: newNotification.name || "Unnamed Notification",
      toEmail: newNotification.toEmail,
      subject: newNotification.subject,
      enabled: newNotification.enabled || true,
      triggerEvent: newNotification.triggerEvent || "form_submit",
    };

    setNotifications([...notifications, notification]);
    setNewNotification({
      name: "",
      toEmail: "",
      subject: "New lead from landing page",
      triggerEvent: "form_submit",
      enabled: true,
    });
    setShowAddForm(false);
  };

  const toggleNotification = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleSaveConfig = async () => {
    // Save to backend
    try {
      await fetch(`/api/pages/${pageId}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifications,
          webhookUrl,
          apiKey,
          emailService,
        }),
      });
      alert("Notification settings saved!");
    } catch (error) {
      console.error("Failed to save notifications:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Lead Capture Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Get notified when someone fills out a form or converts
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveConfig}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Config
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Email Service Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Settings className="w-4 h-4 inline mr-1" />
            Email Service Provider
          </label>
          <select
            value={emailService}
            onChange={(e) =>
              setEmailService(e.target.value as typeof emailService)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="resend">Resend (Recommended)</option>
            <option value="sendgrid">SendGrid</option>
            <option value="webhook">Custom Webhook</option>
          </select>
        </div>

        {/* API Key */}
        {emailService !== "webhook" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Your ${emailService === "resend" ? "Resend" : "SendGrid"} API key`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {emailService === "resend"
                ? "Get your API key from resend.com/api-keys"
                : "Get your API key from sendgrid.com/settings/api_keys"}
            </p>
          </div>
        )}

        {/* Webhook URL */}
        {emailService === "webhook" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-server.com/webhook"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Webhook will receive POST requests with lead data as JSON
            </p>
          </div>
        )}

        {/* Notifications List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Notification
              </button>
            )}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">
                New Notification
              </h5>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newNotification.name}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, name: e.target.value })
                  }
                  placeholder="Notification name (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="email"
                  value={newNotification.toEmail}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      toEmail: e.target.value,
                    })
                  }
                  placeholder="Recipient email *"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={newNotification.subject}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Email subject *"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newNotification.triggerEvent}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      triggerEvent: e.target.value as EmailNotification["triggerEvent"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="form_submit">Form Submission</option>
                  <option value="lead_capture">Lead Capture</option>
                  <option value="any_interaction">Any Interaction</option>
                </select>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddNotification}
                    disabled={!newNotification.toEmail || !newNotification.subject}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleNotification(notification.id)}
                    className={`mt-0.5 w-10 h-6 rounded-full transition-colors relative ${
                      notification.enabled ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                        notification.enabled ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {notification.name}
                    </h5>
                    <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                      <p>
                        <Mail className="w-3 h-3 inline mr-1" />
                        To: {notification.toEmail}
                      </p>
                      <p>Subject: {notification.subject}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        Trigger: {notification.triggerEvent.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Note:</strong> Email notifications will be sent using the configured service whenever a trigger event occurs. Make sure your API key has the necessary permissions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
