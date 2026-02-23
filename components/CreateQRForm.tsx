"use client";

import { useState, useTransition } from "react";
import { createSmartLink } from "../actions/qr";

export default function CreateQRForm() {
  const [isPending, startTransition] = useTransition();
  const [qrImage, setQrImage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await createSmartLink(formData);
        if (result.success) setQrImage(result.qrImageBase64);
      } catch (error) {
        console.error("Failed to create QR:", error);
      }
    });
  };

  return (
    <div className="max-w-xl p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Generate Smart Link</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title (Optional)</label>
          <input 
            type="text" 
            name="title" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Summer Promo Poster"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination URL</label>
          <input 
            type="url" 
            name="destinationUrl" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Advanced Routing (Optional)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600">iOS Fallback URL</label>
              <input 
                type="url" 
                name="iosUrl" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="https://apps.apple.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">Android Fallback URL</label>
              <input 
                type="url" 
                name="androidUrl" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="https://play.google.com/..."
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {isPending ? "Generating..." : "Create Smart QR"}
        </button>
      </form>

      {qrImage && (
        <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
          <img src={qrImage} alt="Generated QR" className="mx-auto w-48 h-48 rounded-md shadow-sm" />
          <a href={qrImage} download="smart-qr.png" className="text-sm font-semibold text-blue-600 hover:underline mt-4 inline-block">
            Download High-Res PNG
          </a>
        </div>
      )}
    </div>
  );
}