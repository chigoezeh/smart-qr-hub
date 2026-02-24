"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter((path) => path);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = "";
    for (const path of paths) {
      currentPath += `/${path}`;
      
      // Format the label
      let label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Handle special cases
      if (path === "qr-codes") label = "QR Codes";
      if (path === "create") label = "Create New";
      if (path === "edit") label = "Edit";
      if (path === "analytics") label = "Analytics";
      
      // Skip UUIDs and short codes (long alphanumeric strings)
      if (path.length > 20 || /^[a-f0-9-]{36}$/i.test(path) || /^[a-zA-Z0-9]{6,12}$/.test(path)) {
        continue;
      }

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on the main dashboard page
  if (pathname === "/dashboard") {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Dashboard</span>
      </Link>

      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <Fragment key={breadcrumb.href}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
