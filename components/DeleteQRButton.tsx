"use client";

import { useState } from "react";
import { deleteQRCode } from "@/actions/qr-update";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteQRButtonProps {
  id: number;
  title: string;
}

export default function DeleteQRButton({ id, title }: DeleteQRButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteQRCode(id);
    
    if (result.success) {
      toast.success("QR code deleted successfully");
      setShowConfirm(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete QR code");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="sm:opacity-0 sm:group-hover:opacity-100 transition-all p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200"
        title="Delete QR Code"
      >
        <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete QR Code?</h3>
                <p className="text-sm text-gray-600 mb-1">
                  This will permanently delete <span className="font-semibold text-gray-900">"{title}"</span>
                </p>
                <p className="text-sm text-gray-600">
                  All analytics data and scans will be lost. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
