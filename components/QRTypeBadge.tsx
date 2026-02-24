import { QRContentType, QR_TYPE_METADATA } from "@/types/qr-content";
import * as LucideIcons from "lucide-react";

interface QRTypeBadgeProps {
  type: QRContentType;
  variant?: "default" | "compact";
}

export default function QRTypeBadge({ type, variant = "default" }: QRTypeBadgeProps) {
  const metadata = QR_TYPE_METADATA[type];
  const IconComponent = (LucideIcons as any)[metadata.icon] || LucideIcons.QrCode;

  if (variant === "compact") {
    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
        style={{
          background: `linear-gradient(135deg, ${metadata.color}10, ${metadata.color}20)`,
          border: `1px solid ${metadata.color}30`,
          color: metadata.color,
        }}
        title={metadata.description}
      >
        <IconComponent className="w-3 h-3" />
        <span className="hidden sm:inline capitalize">{type}</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${metadata.color}15, ${metadata.color}25)`,
        border: `1.5px solid ${metadata.color}40`,
        color: metadata.color,
      }}
    >
      <IconComponent className="w-4 h-4" />
      <span className="capitalize">{type}</span>
      {metadata.supportsSmartRouting && (
        <span className="text-xs bg-white/80 px-1.5 py-0.5 rounded">Smart</span>
      )}
    </div>
  );
}
