import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import PasswordVerificationForm from "@/components/PasswordVerificationForm";
import { Shield, Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export default async function PasswordVerificationPage({ params }: PageProps) {
  const { shortCode } = await params;

  // Fetch QR code to verify it exists and is password protected
  const [qrCode] = await db
    .select({
      id: qrCodes.id,
      title: qrCodes.title,
      isPasswordProtected: qrCodes.isPasswordProtected,
    })
    .from(qrCodes)
    .where(eq(qrCodes.shortCode, shortCode))
    .limit(1);

  if (!qrCode) {
    notFound();
  }

  if (!qrCode.isPasswordProtected) {
    // If not password protected, redirect to the QR link directly
    const redirectUrl = `/q/${shortCode}`;
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600">Redirecting...</p>
          <meta httpEquiv="refresh" content={`0;url=${redirectUrl}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Security Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl shadow-2xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Password Protected
          </h1>
          <p className="text-gray-600">
            This QR code requires authentication
          </p>
        </div>

        {/* QR Code Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Accessing</p>
              <p className="font-bold text-gray-900">{qrCode.title || "Secure QR Code"}</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-800">
              🔒 <strong>Security Notice:</strong> Enter the password to access this content
            </p>
          </div>
        </div>

        {/* Password Form */}
        <PasswordVerificationForm shortCode={shortCode} />

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by Smart-Link Hub Security
          </p>
        </div>
      </div>
    </div>
  );
}
