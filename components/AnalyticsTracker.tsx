"use client";

import { useEffect, useRef } from "react";

interface AnalyticsTrackerProps {
  slug: string;
}

export default function AnalyticsTracker({ slug }: AnalyticsTrackerProps) {
  const viewSentRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const blocksViewedRef = useRef<number[]>([]);
  const linksClickedRef = useRef<number[]>([]);

  useEffect(() => {
    // Send initial view event
    if (!viewSentRef.current) {
      viewSentRef.current = true;
      sendViewEvent();
    }

    // Track blocks viewed with Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const blockId = entry.target.getAttribute("data-block-id");
            if (blockId && !blocksViewedRef.current.includes(Number(blockId))) {
              blocksViewedRef.current.push(Number(blockId));
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all blocks
    const blocks = document.querySelectorAll("[data-block-id]");
    blocks.forEach((block) => observer.observe(block));

    // Track link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[data-link-id]");
      if (link) {
        const linkId = link.getAttribute("data-link-id");
        if (linkId && !linksClickedRef.current.includes(Number(linkId))) {
          linksClickedRef.current.push(Number(linkId));
        }
      }
    };

    document.addEventListener("click", handleLinkClick);

    // Send analytics on page unload
    const handleBeforeUnload = () => {
      const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      sendViewEvent(timeOnPage);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Also send analytics periodically (every 30 seconds)
    const interval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      sendViewEvent(timeOnPage);
    }, 30000);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleLinkClick);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);
    };
  }, [slug]);

  const sendViewEvent = async (timeOnPage?: number) => {
    try {
      await fetch("/api/analytics/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          timeOnPage,
          blocksViewed: blocksViewedRef.current.length > 0 ? blocksViewedRef.current : null,
          linksClicked: linksClickedRef.current.length > 0 ? linksClickedRef.current : null,
        }),
        keepalive: true, // Ensures request completes even if page is closing
      });
    } catch (error) {
      // Silently fail - analytics shouldn't break user experience
      console.error("Analytics error:", error);
    }
  };

  return null; // This component doesn't render anything
}
