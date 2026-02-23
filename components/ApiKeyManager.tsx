"use client";

import { useState, useTransition } from "react";
import { Key, Plus, Trash2, Copy, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { generateApiKey, deleteApiKey } from "@/actions/api-keys";

interface ApiKey {
  id: number;
  name: string;
  keyPreview: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  isActive: boolean;
}

interface ApiKeyManagerProps {
  initialKeys: ApiKey[];
}

export default function ApiKeyManager({ initialKeys }: ApiKeyManagerProps) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    startTransition(async () => {
      try {
        const result = await generateApiKey(newKeyName);
        
        if (result.success && result.apiKey && result.fullKey) {
          // Add new key to list
          setKeys([result.apiKey, ...keys]);
          setNewlyGeneratedKey(result.fullKey);
          setNewKeyName("");
          setShowKey(true);
          
          toast.success("API Key created successfully!", {
            description: "Make sure to copy it - you won't see it again",
          });
        } else {
          toast.error(result.error || "Failed to create API key");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    });
  };

  const handleDeleteKey = async (keyId: number, keyName: string) => {
    if (!confirm(`Are you sure you want to delete "${keyName}"? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteApiKey(keyId);
        
        if (result.success) {
          setKeys(keys.filter(k => k.id !== keyId));
          toast.success("API Key deleted");
        } else {
          toast.error(result.error || "Failed to delete API key");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API Key copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-7 h-7 text-purple-600" />
            API Keys
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage developer access to your QR codes programmatically
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      {/* Create New Key Form */}
      {isCreating && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Create New API Key</h3>
          </div>
          
          <form onSubmit={handleCreateKey} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                placeholder="e.g., Mobile App Integration"
                disabled={isPending}
              />
              <p className="text-xs text-gray-500 mt-2">
                Choose a descriptive name to identify where this key will be used
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending || !newKeyName.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? "Creating..." : "Generate Key"}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Newly Generated Key Display */}
      {newlyGeneratedKey && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-green-900 mb-1">Save Your API Key Now!</h4>
              <p className="text-sm text-green-700">
                This is the only time you'll see the full key. Copy it and store it securely.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-green-300 rounded-xl p-4 flex items-center gap-3">
            <code className="flex-1 font-mono text-sm text-gray-900 break-all">
              {showKey ? newlyGeneratedKey : "•".repeat(newlyGeneratedKey.length)}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              {showKey ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
            </button>
            <button
              onClick={() => copyKey(newlyGeneratedKey)}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Copy className="w-5 h-5 text-green-600" />
            </button>
          </div>

          <button
            onClick={() => setNewlyGeneratedKey(null)}
            className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
          >
            I've Saved It Safely
          </button>
        </div>
      )}

      {/* API Keys List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            Active API Keys ({keys.length})
          </h3>
        </div>

        {keys.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Key className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="font-semibold mb-1">No API keys yet</p>
            <p className="text-sm">Create your first API key to start using the developer API</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {keys.map((key) => (
              <div
                key={key.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900">{key.name}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          key.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {key.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-mono text-xs bg-gray-100 px-3 py-2 rounded-lg inline-block">
                        {key.keyPreview}
                      </p>
                      <p className="text-xs">
                        Created: {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                      {key.lastUsedAt && (
                        <p className="text-xs">
                          Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteKey(key.id, key.name)}
                    disabled={isPending}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete API key"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documentation Link */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-gray-700">
          📚 <strong>Developer Documentation:</strong>{" "}
          <a href="/docs/api" className="text-blue-600 hover:text-blue-700 underline font-semibold">
            View API Reference
          </a>
        </p>
      </div>
    </div>
  );
}
