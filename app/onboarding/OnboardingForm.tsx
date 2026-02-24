"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createWorkspaceAction } from "@/app/onboarding/actions";

export default function OnboardingForm() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!workspaceName.trim()) {
      setError("Please enter a workspace name");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createWorkspaceAction(workspaceName);
        if (result.success) {
          router.push("/dashboard");
        } else {
          setError(result.error || "Failed to create workspace");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-2">
          Workspace Name
        </label>
        <input
          type="text"
          id="workspaceName"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          placeholder="e.g., Acme Corp, My Business, Personal"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          disabled={isPending}
          autoFocus
        />
        <p className="mt-2 text-xs text-gray-500">
          This is where all your QR codes and analytics will be stored.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? "Creating workspace..." : "Create Workspace"}
      </button>
    </form>
  );
}
