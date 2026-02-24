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
  },
  {
    name: "QR Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
    description: "Manage all QR codes",
  },
  {
    name: "Landing Pages",
    href: "/dashboard/pages",
    icon: Globe,
    description: "Bio links & vCards",
  },
  {
    name: "API Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "API keys & webhooks",
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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 lg:border-r lg:border-gray-200 lg:bg-white/50 lg:backdrop-blur-sm">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-4 space-y-1">
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
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                      active
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        active ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.name}</div>
                      {!active && (
                        <div className="text-xs text-gray-500 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quick Actions
              </div>
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all"
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Additional Links */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Resources
              </div>
              <Link
                href="/"
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <Home className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700" />
                Home Page
              </Link>
              <a
                href="/API_DOCUMENTATION.md"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <Book className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700" />
                API Docs
              </a>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
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
                  {item.name}
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
