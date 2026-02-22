"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          setScanResult(decodedText);
          html5QrCode.stop().catch(console.error); // Stop scanning after success
        },
        () => {
          // Ignore general scan failures to keep the feed running
        }
      )
      .catch((err) => {
        setError(`Camera start failed: ${err.message || err}`);
      });

    // Cleanup function when component unmounts
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Scan QR / Barcode</h2>
      
      {error ? (
        <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>
      ) : (
        <div id="reader" className="w-full max-w-sm rounded-lg overflow-hidden border-2 border-gray-300"></div>
      )}

      {scanResult && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg w-full max-w-sm text-center">
          <p className="font-semibold">Scanned Result:</p>
          <p className="break-words">{scanResult}</p>
        </div>
      )}
    </div>
  );
}