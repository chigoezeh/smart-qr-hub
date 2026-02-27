"use client";

import { useEffect, useRef } from "react";
import { PageElement, ScrollAnimationConfig, HoverEffectConfig } from "@/types/landing-page";
import { initPageAnimations, cleanupPageAnimations } from "@/lib/animation-runtime";

interface AnimationInitializerProps {
  rootElement: PageElement;
}

/**
 * Recursively traverse the page structure and collect animation configs
 */
function collectAnimations(
  element: PageElement,
  accumulator: Array<{
    id: string;
    scrollConfig?: ScrollAnimationConfig;
    hoverConfig?: HoverEffectConfig;
  }>
): void {
  // Add current element's animations
  if (element.animationConfig?.scroll || element.animationConfig?.hover) {
    accumulator.push({
      id: element.id,
      scrollConfig: element.animationConfig.scroll,
      hoverConfig: element.animationConfig.hover,
    });
  }

  // Recursively process children
  element.children.forEach((child) => collectAnimations(child, accumulator));
}

/**
 * AnimationInitializer
 * 
 * Client component that initializes scroll animations and hover effects
 * for landing page elements. Uses IntersectionObserver for scroll animations
 * and injects CSS for hover effects.
 * 
 * Usage:
 * <AnimationInitializer rootElement={pageStructure} />
 */
export default function AnimationInitializer({ rootElement }: AnimationInitializerProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Collect all animations from the page structure
    const animations: Array<{
      id: string;
      scrollConfig?: ScrollAnimationConfig;
      hoverConfig?: HoverEffectConfig;
    }> = [];

    collectAnimations(rootElement, animations);

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      // Find DOM elements and initialize animations
      const elements = animations
        .map(({ id, scrollConfig, hoverConfig }) => {
          // Find element by custom ID or data attribute
          const element = 
            document.getElementById(id) ||
            document.querySelector(`[data-element-id="${id}"]`) as HTMLElement;

          if (!element) {
            console.warn(`Animation target element not found: ${id}`);
            return null;
          }

          return {
            id,
            element,
            scrollConfig,
            hoverConfig,
          };
        })
        .filter((item) => item !== null) as Array<{
          id: string;
          element: HTMLElement;
          scrollConfig?: ScrollAnimationConfig;
          hoverConfig?: HoverEffectConfig;
        }>;

      // Initialize animations
      if (elements.length > 0) {
        initPageAnimations(elements);
      }
    }, 100); // Small delay to ensure DOM is fully rendered

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      cleanupPageAnimations();
    };
  }, [rootElement]);

  // This component doesn't render anything
  return null;
}
