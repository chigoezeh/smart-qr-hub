"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  QrCode, 
  Globe, 
  Settings, 
  Plus, 
  BarChart3,
  Book,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & statistics",
    color: "blue",
  },
  {
    name: "My QR Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
    description: "Manage all QR codes",
    color: "purple",
  },
  {
    name: "Landing Pages",
    href: "/dashboard/pages",
    icon: Globe,
    description: "Bio links & vCards",
    color: "indigo",
  },
  {
    name: "API Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "API keys & webhooks",
    color: "slate",
  },
];

const quickActions = [
  {
    name: "Create QR Code",
    href: "/dashboard/create",
    icon: Plus,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getIconColor = (color: string, active: boolean) => {
    if (active) return "text-white";
    
    const colorMap: Record<string, string> = {
      blue: "text-blue-600 group-hover:text-blue-700",
      purple: "text-purple-600 group-hover:text-purple-700",
      indigo: "text-indigo-600 group-hover:text-indigo-700",
      slate: "text-slate-600 group-hover:text-slate-700",
    };
    
    return colorMap[color] || "text-gray-600 group-hover:text-gray-700";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:top-16 lg:border-r lg:border-gray-200/80 lg:bg-gradient-to-b lg:from-white lg:via-gray-50/50 lg:to-white lg:backdrop-blur-xl lg:shadow-sm">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Navigation Header */}
          <div className="px-6 pt-6 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</span>
            </div>
          </div>

          <nav className="flex-1 px-4 pb-4 space-y-1">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-start px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 overflow-hidden",
                      active
                        ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                        : "text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.01]"
                    )}
                  >
                    {/* Accent Line */}
                    {active && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40 rounded-r-full"></div>
                    )}
                    
                    {/* Icon Container */}
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg mr-3.5 flex-shrink-0 transition-all duration-200",
                      active 
                        ? "bg-white/20" 
                        : "bg-gray-100 group-hover:bg-gray-200"
                    )}>
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-all duration-200",
                          getIconColor(item.color, active)
                        )}
                      />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className={cn(
                        "truncate font-semibold mb-0.5",
                        active ? "text-white" : "text-gray-900"
                      )}>
                        {item.name}
                      </div>
                      <div className={cn(
                        "text-xs truncate transition-all duration-200",
                        active 
                          ? "text-blue-100" 
                          : "text-gray-500 group-hover:text-gray-600"
                      )}>
                        {item.description}
                      </div>
                    </div>

                    {/* Hover Indicator */}
                    {!active && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="pt-6 mt-6 border-t border-gray-200/60">
              <div className="px-4 mb-3 flex items-center gap-2">
                <div className="h-1 w-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</span>
              </div>
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative flex items-center px-4 py-3.5 rounded-xl text-white bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 shadow-lg shadow-blue-500/40 hover:shadow-blue-600/60 hover:scale-[1.02] transition-all duration-200 overflow-hidden"
                  >
                    {/* Animated Background Shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 mr-3.5 flex-shrink-0 relative z-10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Additional Links */}
            <div className="pt-6 mt-6 border-t border-gray-200/60">
              <div className="px-4 mb-3 flex items-center gap-2">
                <div className="h-1 w-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources</span>
              </div>
              <div className="space-y-1">
                <Link
                  href="/"
                  className="group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl text-gray-700 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 mr-3 flex-shrink-0 transition-all duration-200">
                    <Home className="h-4 w-4 text-gray-600 group-hover:text-gray-700" />
                  </div>
                  <span>Home Page</span>
                </Link>
                <a
                  href="/API_DOCUMENTATION.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl text-gray-700 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 mr-3 flex-shrink-0 transition-all duration-200">
                    <Book className="h-4 w-4 text-gray-600 group-hover:text-gray-700" />
                  </div>
                  <span>API Docs</span>
                </a>
              </div>
            </div>

            {/* Bottom Branding */}
            <div className="mt-6 px-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-xl p-4 border border-gray-200/60">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Smart-Link Hub</div>
                    <div className="text-[10px] text-gray-500">Enterprise Platform</div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-40 safe-area-bottom shadow-lg">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all",
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-1", active && "text-blue-600")} />
                <span className="text-xs font-medium truncate max-w-full">
                  {item.name === "My QR Codes" ? "My QRs" : item.name}
                </span>
              </Link>
            );
          })}
          <Link
            href="/dashboard/create"
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
          >
            <Plus className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Create</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
