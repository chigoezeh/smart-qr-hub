"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface Workspace {
  id: number;
  name: string;
  slug: string;
  plan: string;
}

interface UseWorkspaceReturn {
  workspace: Workspace | null;
  role: "owner" | "admin" | "member" | "viewer" | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Client-side hook to access current workspace information
 * Note: For server components, use lib/workspace.ts functions instead
 */
export function useWorkspace(): UseWorkspaceReturn {
  const { user, isLoaded } = useUser();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [role, setRole] = useState<"owner" | "admin" | "member" | "viewer" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    // Fetch workspace info from API
    fetch("/api/workspace/current")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch workspace");
        return res.json();
      })
      .then((data) => {
        setWorkspace(data.workspace);
        setRole(data.role);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [user, isLoaded]);

  return { workspace, role, isLoading, error };
}
