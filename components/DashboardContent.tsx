"use client";

import { QRContentType } from "@/types/qr-content";
import { useState, useMemo } from "react";
import QRTableRow from "./QRTableRow";
import DashboardFilters from "./DashboardFilters";
import { QrCode, Plus, Search } from "lucide-react";
import Link from "next/link";

interface QRCodeData {
  id: number;
  title: string | null;
  shortCode: string;
  destinationUrl: string | null;
  contentType: string;
  createdAt: Date;
  status: string | null;
  scanCount: number;
}

interface DashboardContentProps {
  data: QRCodeData[];
}

export default function DashboardContent({ data }: DashboardContentProps) {
  const [filterType, setFilterType] = useState<QRContentType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Type filter
      const typeMatch = filterType === "all" || item.contentType === filterType;

      // Search filter
      const searchMatch =
        searchQuery === "" ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destinationUrl?.toLowerCase().includes(searchQuery.toLowerCase());

      return typeMatch && searchMatch;
    });
  }, [data, filterType, searchQuery]);

  return (
    <>
      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, code, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 focus:border-blue-400 rounded-xl font-medium text-gray-700 placeholder-gray-400 transition-all focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
        <DashboardFilters onFilterChange={setFilterType} />
      </div>

      {/* Results Summary */}
      {(filterType !== "all" || searchQuery !== "") && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredData.length}</span> of{" "}
            <span className="font-bold text-gray-900">{data.length}</span> QR codes
          </span>
          {(filterType !== "all" || searchQuery !== "") && (
            <button
              onClick={() => {
                setFilterType("all");
                setSearchQuery("");
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* QR Codes Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700 text-xs font-bold uppercase tracking-wider border-b-2 border-gray-200">
                <th className="p-4 text-left">QR Code</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left hidden lg:table-cell">Destination</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 sm:p-16 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-500">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                        {data.length === 0 ? (
                          <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                        ) : (
                          <Search className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
                          {data.length === 0 ? "No QR codes yet" : "No matching QR codes"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {data.length === 0
                            ? "Create your first smart link to unlock powerful analytics"
                            : "Try adjusting your filters or search query"}
                        </p>
                      </div>
                      {data.length === 0 && (
                        <Link
                          href="/dashboard/create"
                          className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Create First QR Code
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <QRTableRow
                    key={row.id}
                    id={row.id}
                    title={row.title || "Untitled"}
                    shortCode={row.shortCode}
                    destinationUrl={row.destinationUrl || ""}
                    contentType={row.contentType as QRContentType}
                    status={row.status || "active"}
                    scanCount={row.scanCount}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
