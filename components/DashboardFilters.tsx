"use client";

import { QRContentType, QR_TYPE_METADATA } from "@/types/qr-content";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import * as LucideIcons from "lucide-react";

interface DashboardFiltersProps {
  onFilterChange: (type: QRContentType | "all") => void;
}

export default function DashboardFilters({ onFilterChange }: DashboardFiltersProps) {
  const [selectedType, setSelectedType] = useState<QRContentType | "all">("all");
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeSelect = (type: QRContentType | "all") => {
    setSelectedType(type);
    onFilterChange(type);
    setIsOpen(false);
  };

  const types = Object.keys(QR_TYPE_METADATA) as QRContentType[];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl font-medium text-gray-700 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">
          Filter: <span className="font-semibold capitalize">{selectedType}</span>
        </span>
        {selectedType !== "all" && (
          <X
            className="w-3.5 h-3.5 hover:bg-gray-100 rounded"
            onClick={(e) => {
              e.stopPropagation();
              handleTypeSelect("all");
            }}
          />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 z-20 w-72 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Filter by Type</p>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              <button
                onClick={() => handleTypeSelect("all")}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                  selectedType === "all"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <LucideIcons.Grid3x3 className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">All Types</p>
                  <p className={`text-xs ${selectedType === "all" ? "text-white/80" : "text-gray-500"}`}>
                    Show everything
                  </p>
                </div>
              </button>

              <div className="h-px bg-gray-200 my-2" />

              {types.map((type) => {
                const metadata = QR_TYPE_METADATA[type];
                const IconComponent = (LucideIcons as any)[metadata.icon] || LucideIcons.QrCode;
                const isSelected = selectedType === type;

                return (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: isSelected
                          ? "rgba(255,255,255,0.2)"
                          : `linear-gradient(135deg, ${metadata.color}20, ${metadata.color}30)`,
                      }}
                    >
                      <IconComponent
                        className="w-4 h-4"
                        style={{ color: isSelected ? "white" : metadata.color }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold capitalize">{type}</p>
                      <p className={`text-xs ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                        {metadata.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
