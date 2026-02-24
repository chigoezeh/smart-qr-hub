"use client";

import { Globe } from "lucide-react";

interface TrackedLinkProps {
  link: {
    id: number;
    title: string;
    url: string;
    icon: string | null;
  };
  buttonClass: string;
}

export default function TrackedLink({ link, buttonClass }: TrackedLinkProps) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track the click (fire and forget)
    try {
      fetch(`/api/track/link/${link.id}`, {
        method: "POST",
        keepalive: true, // Ensure request completes even if user navigates away
      }).catch(() => {
        // Silently fail - don't block navigation
      });
    } catch (error) {
      // Silently fail - don't block navigation
    }

    // Let the default link behavior continue
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`link-button block w-full px-6 py-4 ${buttonClass} rounded-2xl font-semibold shadow-lg transition-all group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {link.icon && <span className="text-2xl">{link.icon}</span>}
          <span>{link.title}</span>
        </div>
        <Globe className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}
