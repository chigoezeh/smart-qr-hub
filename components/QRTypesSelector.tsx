"use client";

import { QRContentType, QR_TYPE_METADATA } from "@/types/qr-content";
import { 
  Link, FileText, User, Mail, MessageSquare, Phone, 
  Wifi, Calendar, MapPin, MessageCircle, Share2, Coins 
} from "lucide-react";

const ICON_MAP = {
  Link, FileText, User, Mail, MessageSquare, Phone,
  Wifi, Calendar, MapPin, MessageCircle, Share2, Coins
};

interface QRTypesSelectorProps {
  selectedType: QRContentType;
  onTypeChange: (type: QRContentType) => void;
}

export default function QRTypesSelector({ selectedType, onTypeChange }: QRTypesSelectorProps) {
  const types = Object.values(QR_TYPE_METADATA);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
          Select QR Code Type
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Choose what kind of information your QR code will contain
        </p>
      </div>

      {/* Grid of type cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {types.map((typeInfo) => {
          const Icon = ICON_MAP[typeInfo.icon as keyof typeof ICON_MAP];
          const isSelected = selectedType === typeInfo.type;
          
          const colorClasses: Record<string, { bg: string; border: string; icon: string; selectedBg: string }> = {
            blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", selectedBg: "from-blue-500 to-blue-600" },
            gray: { bg: "bg-gray-50", border: "border-gray-200", icon: "text-gray-600", selectedBg: "from-gray-500 to-gray-600" },
            purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", selectedBg: "from-purple-500 to-purple-600" },
            red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", selectedBg: "from-red-500 to-red-600" },
            green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", selectedBg: "from-green-500 to-green-600" },
            indigo: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-600", selectedBg: "from-indigo-500 to-indigo-600" },
            cyan: { bg: "bg-cyan-50", border: "border-cyan-200", icon: "text-cyan-600", selectedBg: "from-cyan-500 to-cyan-600" },
            orange: { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-600", selectedBg: "from-orange-500 to-orange-600" },
            pink: { bg: "bg-pink-50", border: "border-pink-200", icon: "text-pink-600", selectedBg: "from-pink-500 to-pink-600" },
            emerald: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600", selectedBg: "from-emerald-500 to-emerald-600" },
            violet: { bg: "bg-violet-50", border: "border-violet-200", icon: "text-violet-600", selectedBg: "from-violet-500 to-violet-600" },
            amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600", selectedBg: "from-amber-500 to-amber-600" },
          };

          const colors = colorClasses[typeInfo.color] || colorClasses.blue;

          return (
            <button
              key={typeInfo.type}
              type="button"
              onClick={() => onTypeChange(typeInfo.type)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${
                isSelected
                  ? `bg-gradient-to-br ${colors.selectedBg} border-transparent shadow-xl scale-105`
                  : `${colors.bg} ${colors.border} hover:scale-102 hover:shadow-lg`
              }`}
            >
              {/* Icon */}
              <div className={`mb-3 ${isSelected ? "text-white" : colors.icon}`}>
                {Icon && <Icon className="w-6 h-6" />}
              </div>

              {/* Label */}
              <div>
                <p className={`text-sm font-bold mb-0.5 ${isSelected ? "text-white" : "text-gray-900"}`}>
                  {typeInfo.label}
                </p>
                <p className={`text-xs ${isSelected ? "text-white/90" : "text-gray-500"}`}>
                  {typeInfo.description.split(" ").slice(0, 4).join(" ")}...
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className={`w-3 h-3 bg-gradient-to-br ${colors.selectedBg} rounded-full`}></div>
                  </div>
                </div>
              )}

              {/* Smart routing badge */}
              {typeInfo.supportsSmartRouting && !isSelected && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-0.5 bg-white border border-blue-200 text-blue-700 rounded-full text-[10px] font-bold shadow-sm">
                    Smart
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected type info */}
      {selectedType && QR_TYPE_METADATA[selectedType].supportsSmartRouting && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-blue-800 font-semibold flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            This type supports smart routing (time-based, language-based, and geo-targeted)
          </p>
        </div>
      )}
    </div>
  );
}
