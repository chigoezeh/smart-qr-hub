/**
 * Animation Runtime for Landing Pages
 * 
 * This module provides client-side animation support for landing pages:
 * 1. Scroll-triggered animations using IntersectionObserver
 * 2. Hover effect CSS generation
 * 
 * Usage:
 * - Call initScrollAnimations() to activate scroll animations
 * - Call generateHoverCSS() to get CSS rules for hover effects
 */

import { ScrollAnimationConfig, HoverEffectConfig } from "@/types/landing-page";

/**
 * Animation state tracking
 */
interface AnimationState {
  elementId: string;
  observer: IntersectionObserver | null;
  hasTriggered: boolean;
}

const activeAnimations = new Map<string, AnimationState>();

/**
 * Initialize scroll animations for a container element
 * @param elementId - Unique ID of the container
 * @param config - Scroll animation configuration
 * @param element - DOM element to animate
 */
export function initScrollAnimation(
  elementId: string,
  config: ScrollAnimationConfig,
  element: HTMLElement
): void {
  // Don't initialize if disabled or already initialized
  if (!config.enabled || activeAnimations.has(elementId)) {
    return;
  }

  // Restore existing state
  const existingState = activeAnimations.get(elementId);
  if (existingState?.observer) {
    existingState.observer.disconnect();
  }

  // Calculate threshold based on trigger point
  const threshold = (config.triggerPoint || 20) / 100;

  // Create IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = activeAnimations.get(elementId);
        if (!state) return;

        const shouldTrigger =
          config.triggerEvent === "exit"
            ? !entry.isIntersecting
            : entry.isIntersecting;

        // Trigger animation based on event type
        if (shouldTrigger && !state.hasTriggered) {
          // Apply animation
          applyScrollAnimation(element, config);
          state.hasTriggered = true;

          // If not "both", disconnect after first trigger
          if (config.triggerEvent !== "enter-exit") {
            observer.disconnect();
          }
        } else if (config.triggerEvent === "enter-exit" && !shouldTrigger) {
          // Reset animation for "enter-exit" mode
          resetScrollAnimation(element, config);
          state.hasTriggered = false;
        }
      });
    },
    {
      threshold,
      rootMargin: "0px",
    }
  );

  // Store state
  activeAnimations.set(elementId, {
    elementId,
    observer,
    hasTriggered: false,
  });

  // Start observing
  observer.observe(element);
}

/**
 * Apply scroll animation to element
 * @param element - DOM element to animate
 * @param config - Scroll animation configuration
 */
function applyScrollAnimation(
  element: HTMLElement,
  config: ScrollAnimationConfig
): void {
  const { type, duration, delay, easing, slideDirection } = config;

  // Apply transition
  element.style.transition = `all ${duration || 800}ms ${easing || "ease-out"} ${delay || 0}ms`;

  // Apply animation based on type
  switch (type) {
    case "fade":
      element.style.opacity = "1";
      break;

    case "slide":
      element.style.opacity = "1";
      element.style.transform = "translateX(0) translateY(0)";
      break;

    case "zoom":
      element.style.opacity = "1";
      element.style.transform = "scale(1)";
      break;

    case "rotate":
      element.style.opacity = "1";
      element.style.transform = "rotate(0deg)";
      break;

    default:
      element.style.opacity = "1";
  }
}

/**
 * Reset scroll animation to initial state
 * @param element - DOM element to reset
 * @param config - Scroll animation configuration
 */
function resetScrollAnimation(
  element: HTMLElement,
  config: ScrollAnimationConfig
): void {
  const { type, slideDirection } = config;

  // Reset to initial state based on type
  switch (type) {
    case "fade":
      element.style.opacity = "0";
      break;

    case "slide":
      element.style.opacity = "0";
      let translateValue = "50px";
      switch (slideDirection) {
        case "up":
          element.style.transform = "translateY(50px)";
          break;
        case "down":
          element.style.transform = "translateY(-50px)";
          break;
        case "left":
          element.style.transform = "translateX(50px)";
          break;
        case "right":
          element.style.transform = "translateX(-50px)";
          break;
        default:
          element.style.transform = "translateY(50px)";
      }
      break;

    case "zoom":
      element.style.opacity = "0";
      element.style.transform = "scale(0.8)";
      break;

    case "rotate":
      element.style.opacity = "0";
      element.style.transform = "rotate(-10deg)";
      break;

    default:
      element.style.opacity = "0";
  }
}

/**
 * Set initial state for scroll animation
 * @param elementId - Unique ID of the container
 * @param config - Scroll animation configuration
 * @param element - DOM element to initialize
 */
export function setInitialScrollAnimationState(
  elementId: string,
  config: ScrollAnimationConfig,
  element: HTMLElement
): void {
  if (!config.enabled) return;

  // Set initial hidden state
  resetScrollAnimation(element, config);
}

/**
 * Cleanup scroll animation observer
 * @param elementId - Unique ID of the container
 */
export function cleanupScrollAnimation(elementId: string): void {
  const state = activeAnimations.get(elementId);
  if (state?.observer) {
    state.observer.disconnect();
    activeAnimations.delete(elementId);
  }
}

/**
 * Initialize all scroll animations on the page
 * @param containerMap - Map of element IDs to { element, config }
 */
export function initAllScrollAnimations(
  containerMap: Map<
    string,
    { element: HTMLElement; config: ScrollAnimationConfig }
  >
): void {
  containerMap.forEach(({ element, config }, elementId) => {
    setInitialScrollAnimationState(elementId, config, element);
    initScrollAnimation(elementId, config, element);
  });
}

/**
 * Cleanup all scroll animations
 */
export function cleanupAllScrollAnimations(): void {
  activeAnimations.forEach((_, elementId) => {
    cleanupScrollAnimation(elementId);
  });
}

/**
 * Generate CSS for hover effects
 * @param elementId - Unique ID of the container
 * @param config - Hover effect configuration
 * @returns CSS string to inject into page
 */
export function generateHoverCSS(
  elementId: string,
  config: HoverEffectConfig
): string {
  if (!config.enabled) return "";

  const {
    duration = 300,
    easing = "ease",
    scale,
    transform,
    boxShadow,
    backgroundColor,
    borderColor,
    opacity,
  } = config;

  // Build transform value
  const transforms: string[] = [];
  if (scale !== undefined) {
    transforms.push(`scale(${scale})`);
  }
  if (transform) {
    transforms.push(transform);
  }

  // Build hover rule
  const hoverRules: string[] = [];

  if (transforms.length > 0) {
    hoverRules.push(`transform: ${transforms.join(" ")};`);
  }
  if (boxShadow) {
    hoverRules.push(`box-shadow: ${boxShadow};`);
  }
  if (backgroundColor) {
    hoverRules.push(`background-color: ${backgroundColor};`);
  }
  if (borderColor) {
    hoverRules.push(`border-color: ${borderColor};`);
  }
  if (opacity !== undefined) {
    hoverRules.push(`opacity: ${opacity / 100};`);
  }

  // Generate CSS
  const css = `
    [data-element-id="${elementId}"] {
      transition: all ${duration}ms ${easing};
    }
    [data-element-id="${elementId}"]:hover {
      ${hoverRules.join("\n      ")}
    }
  `;

  return css;
}

/**
 * Generate CSS for all hover effects in a page
 * @param effectsMap - Map of element IDs to hover effect configs
 * @returns Combined CSS string
 */
export function generateAllHoverCSS(
  effectsMap: Map<string, HoverEffectConfig>
): string {
  const cssRules: string[] = [];

  effectsMap.forEach((config, elementId) => {
    const css = generateHoverCSS(elementId, config);
    if (css) {
      cssRules.push(css);
    }
  });

  return cssRules.join("\n\n");
}

/**
 * Inject hover CSS into the page
 * @param css - CSS string to inject
 * @param styleId - ID for the style tag (default: "hover-effects")
 */
export function injectHoverCSS(css: string, styleId = "hover-effects"): void {
  // Remove existing style tag if present
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style tag
  const styleTag = document.createElement("style");
  styleTag.id = styleId;
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
}

/**
 * Helper function to batch initialize all animations for a page
 * @param elements - Array of { id, element, scrollConfig, hoverConfig }
 */
export function initPageAnimations(
  elements: Array<{
    id: string;
    element: HTMLElement;
    scrollConfig?: ScrollAnimationConfig;
    hoverConfig?: HoverEffectConfig;
  }>
): void {
  // Initialize scroll animations
  const scrollMap = new Map<
    string,
    { element: HTMLElement; config: ScrollAnimationConfig }
  >();
  const hoverMap = new Map<string, HoverEffectConfig>();

  elements.forEach(({ id, element, scrollConfig, hoverConfig }) => {
    // Add data-element-id attribute for CSS targeting
    element.setAttribute("data-element-id", id);

    // Collect scroll animations
    if (scrollConfig?.enabled) {
      scrollMap.set(id, { element, config: scrollConfig });
    }

    // Collect hover effects
    if (hoverConfig?.enabled) {
      hoverMap.set(id, hoverConfig);
    }
  });

  // Initialize scroll animations
  initAllScrollAnimations(scrollMap);

  // Generate and inject hover CSS
  const hoverCSS = generateAllHoverCSS(hoverMap);
  if (hoverCSS) {
    injectHoverCSS(hoverCSS);
  }
}

/**
 * Cleanup all page animations
 */
export function cleanupPageAnimations(): void {
  cleanupAllScrollAnimations();

  // Remove hover CSS
  const hoverStyle = document.getElementById("hover-effects");
  if (hoverStyle) {
    hoverStyle.remove();
  }
}
