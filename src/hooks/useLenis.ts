/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect } from "react";
import {
  LenisContext,
  type LenisContextValue,
  type ScrollToOptions,
} from "../context/LenisContext";

// useLenis hook
export const useLenis = (): LenisContextValue => {
  const context = useContext(LenisContext);

  if (!context) {
    throw new Error("useLenis must be used within a LenisProvider");
  }

  return context;
};

// Enhanced useScrollTo hook with GSAP ScrollTrigger compatibility
export const useScrollTo = () => {
  const { lenis, isReady } = useLenis();

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: ScrollToOptions) => {
      if (!lenis || !isReady) {
        console.warn("Lenis not ready yet");
        return;
      }
      lenis.scrollTo(target, options);
    },
    [lenis, isReady]
  );

  const scrollToTop = useCallback(
    (options?: ScrollToOptions) => {
      scrollTo(0, options);
    },
    [scrollTo]
  );

  const scrollToBottom = useCallback(
    (options?: ScrollToOptions) => {
      scrollTo("bottom", options);
    },
    [scrollTo]
  );

  const scrollToElement = useCallback(
    (selector: string, options?: ScrollToOptions) => {
      if (!lenis || !isReady) {
        console.warn("Lenis not ready yet");
        return;
      }

      // Handle both CSS selectors and direct element references
      let targetElement: HTMLElement | null = null;

      if (selector.startsWith("#") || selector.startsWith(".")) {
        // Use selector as is for CSS selectors
        targetElement = document.querySelector(selector);
      } else {
        // Add # if it's just an ID without the hash
        targetElement = document.querySelector(`#${selector}`);
      }

      if (!targetElement) {
        console.warn(`Element with selector "${selector}" not found`);
        return;
      }

      // Calculate accurate position accounting for pinned sections
      const getElementPosition = (element: HTMLElement): number => {
        let top = 0;
        let currentElement: HTMLElement | null = element;

        // Traverse up the DOM tree to calculate cumulative offset
        while (currentElement && currentElement !== document.body) {
          // Check if element has transform that might affect position
          const style = window.getComputedStyle(currentElement);
          const position = style.position;

          // Use getBoundingClientRect for pinned/fixed elements
          if (position === "fixed" || position === "sticky") {
            const rect = element.getBoundingClientRect();
            return window.scrollY + rect.top;
          }

          top += currentElement.offsetTop;
          currentElement = currentElement.offsetParent as HTMLElement;
        }

        return top;
      };

      const elementTop = getElementPosition(targetElement) + (options?.offset || 0);

      // Force scroll to position instead of element
      lenis.scrollTo(elementTop, {
        ...options,
        onStart: (instance: any) => {
          options?.onStart?.(instance);
        },
        onComplete: (instance: any) => {
          options?.onComplete?.(instance);
        },
      });
    },
    [lenis, isReady]
  );

  const scrollToPosition = useCallback(
    (position: number, options?: ScrollToOptions) => {
      scrollTo(position, options);
    },
    [scrollTo]
  );

  // New methods for better GSAP integration
  const start = useCallback(() => {
    if (lenis && isReady) {
      lenis.start();
    }
  }, [lenis, isReady]);

  const stop = useCallback(() => {
    if (lenis && isReady) {
      lenis.stop();
    }
  }, [lenis, isReady]);

  const resize = useCallback(() => {
    if (lenis && isReady) {
      lenis.resize();
    }
  }, [lenis, isReady]);

  const destroy = useCallback(() => {
    if (lenis && isReady) {
      lenis.destroy();
    }
  }, [lenis, isReady]);

  const on = useCallback(
    (event: string, callback: (lenis: any) => void) => {
      if (lenis && isReady) {
        return lenis.on(event, callback);
      }
    },
    [lenis, isReady]
  );

  const off = useCallback(
    (event: string, callback: (lenis: any) => void) => {
      if (lenis && isReady) {
        return lenis.off(event, callback);
      }
    },
    [lenis, isReady]
  );

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollToElement,
    scrollToPosition,
    start,
    stop,
    resize,
    destroy,
    on,
    off,
    isReady,
    lenis,
  };
};

// Hook for ScrollTrigger integration
export const useLenisScrollTrigger = () => {
  const { lenis, isReady } = useLenis();

  useEffect(() => {
    if (!lenis || !isReady) return;

    // ScrollTrigger refresh when Lenis is ready
    const refreshScrollTrigger = () => {
      if (typeof window !== "undefined" && (window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.refresh();
      }
    };

    // Listen for scroll events to update ScrollTrigger
    const handleScroll = () => {
      if (typeof window !== "undefined" && (window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.update();
      }
    };

    lenis.on("scroll", handleScroll);
    refreshScrollTrigger();

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis, isReady]);

  return { lenis, isReady };
};
