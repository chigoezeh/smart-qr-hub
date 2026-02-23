"use client";

import { useState, useTransition } from "react";
import { verifyQRPassword } from "@/actions/qr-security";
import { Key, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PasswordVerificationFormProps {
  shortCode: string;
}

export default function PasswordVerificationForm({ shortCode }: PasswordVerificationFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    startTransition(async () => {
      try {
        const result = await verifyQRPassword(shortCode, password);
        
        if (result.success) {
          toast.success("Access granted!", {
            description: "Redirecting to content...",
          });
          
          // Store verification token in sessionStorage
          sessionStorage.setItem(`qr_verified_${shortCode}`, result.token!);
          
          // Redirect to the actual QR endpoint with token
          window.location.href = `/q/${shortCode}?token=${result.token}`;
        } else {
          setError(result.error || "Invalid password");
          toast.error("Access denied", {
            description: result.error || "Incorrect password",
          });
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        toast.error("Verification failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden">
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Key className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
              placeholder="Enter password"
              disabled={isPending}
              autoComplete="off"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || !password.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Key className="w-5 h-5" />
              Verify & Access
            </>
          )}
        </button>
      </div>

      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          💡 <strong>Tip:</strong> The password was provided by the QR code creator
        </p>
      </div>
    </form>
  );
}
