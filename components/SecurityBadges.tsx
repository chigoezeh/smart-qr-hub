import { Lock, Clock, Hash, MapPin, Shield } from "lucide-react";

interface SecurityBadgesProps {
  isPasswordProtected: boolean;
  hasExpiration: boolean;
  hasMaxScans: boolean;
  hasGeofence: boolean;
  variant?: "default" | "compact";
}

export default function SecurityBadges({
  isPasswordProtected,
  hasExpiration,
  hasMaxScans,
  hasGeofence,
  variant = "default",
}: SecurityBadgesProps) {
  const badges = [];

  if (isPasswordProtected) {
    badges.push({
      icon: Lock,
      label: "Password",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    });
  }

  if (hasExpiration) {
    badges.push({
      icon: Clock,
      label: "Expiring",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
    });
  }

  if (hasMaxScans) {
    badges.push({
      icon: Hash,
      label: "Limited",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    });
  }

  if (hasGeofence) {
    badges.push({
      icon: MapPin,
      label: "Geofenced",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    });
  }

  if (badges.length === 0) {
    return null;
  }

  // Compact variant - just show shield with count
  if (variant === "compact") {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg"
        title={badges.map(b => b.label).join(", ")}
      >
        <Shield className="w-3.5 h-3.5 text-red-600" />
        <span className="text-xs font-bold text-red-700">{badges.length}</span>
      </div>
    );
  }

  // Default variant - show all badges
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className={`inline-flex items-center gap-1 px-2 py-1 ${badge.bg} border ${badge.border} rounded-md`}
            title={badge.label}
          >
            <Icon className={`w-3 h-3 ${badge.color}`} />
            <span className={`text-xs font-semibold ${badge.color} hidden sm:inline`}>
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
