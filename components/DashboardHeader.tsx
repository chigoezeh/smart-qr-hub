"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { QrCode, Menu, X } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  workspaceName?: string;
  workspacePlan?: string;
  userRole?: string;
}

export default function DashboardHeader({
  workspaceName,
  workspacePlan,
  userRole,
}: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Workspace Info */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart-Link Hub
                </div>
                {workspaceName && (
                  <div className="text-xs text-gray-600">
                    {workspaceName}
                    {workspacePlan && (
                      <>
                        {" · "}
                        <span className="capitalize">{workspacePlan}</span>
                      </>
                    )}
                    {userRole && (
                      <>
                        {" · "}
                        <span className="capitalize">{userRole}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop User Button */}
          <div className="hidden md:flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {workspaceName && (
                  <>
                    {workspaceName}
                    {workspacePlan && (
                      <>
                        {" · "}
                        <span className="capitalize">{workspacePlan}</span>
                      </>
                    )}
                  </>
                )}
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
