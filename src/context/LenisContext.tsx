/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  direction?: "vertical" | "horizontal";
  gestureDirection?: "vertical" | "horizontal" | "both";
  smooth?: boolean;
  mouseMultiplier?: number;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
  wrapper?: Window | HTMLElement;
  content?: HTMLElement;
  wheelEventsTarget?: Window | HTMLElement;
  eventsTarget?: Window | HTMLElement;
  syncTouch?: boolean;
  syncTouchLerp?: number;
  touchInertiaMultiplier?: number;
  orientation?: "vertical" | "horizontal";
  lerp?: number;
  className?: string;
  wheelMultiplier?: number;
  normalizeWheel?: boolean;
  autoResize?: boolean;
}

export interface ScrollToOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
  immediate?: boolean;
  lock?: boolean;
  force?: boolean;
  onComplete?: (lenis: any) => void;
  onStart?: (lenis: any) => void;
}

export interface LenisContextValue {
  lenis: any | null;
  isReady: boolean;
}

// LenisProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";

// GSAP imports (optional - will be loaded if available)
let gsap: any;
let ScrollTrigger: any;

const LenisContext = createContext<LenisContextValue | null>(null);

// Export the context
export { LenisContext };

interface LenisProviderProps {
  children: ReactNode;
  options?: LenisOptions;
  autoRaf?: boolean;
  rafPriority?: number;
  className?: string;
  root?: boolean;
}

export const LenisProvider: React.FC<LenisProviderProps> = ({
  children,
  options = {},
  autoRaf = true,
  rafPriority = 0,
  className,
  root = false,
}) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const scrollTriggerRef = useRef<any>(null);

  useEffect(() => {
    // Load GSAP and ScrollTrigger dynamically
    const loadGSAP = async () => {
      try {
        const gsapModule = await import("gsap");
        const scrollTriggerModule = await import("gsap/ScrollTrigger");

        const gsap = gsapModule.default || gsapModule;
        const ScrollTrigger =
          scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);
        scrollTriggerRef.current = ScrollTrigger;
        setGsapLoaded(true);

        // Disable GSAP's default smooth scrolling
        gsap.ticker.lagSmoothing(0);
      } catch {
        // GSAP not available
        console.log("GSAP not available");
      }
    };

    loadGSAP();
  }, []);

  useEffect(() => {
    // Default options optimized for GSAP ScrollTrigger
    const defaultOptions: LenisOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
      normalizeWheel: true,
      lerp: 0.1, // Optimized for ScrollTrigger
      ...options,
    };

    // console.log("Initializing Lenis with options:", defaultOptions);

    // Initialize Lenis
    lenisRef.current = new Lenis(defaultOptions);

    // console.log("Lenis initialized:", lenisRef.current);

    // Start Lenis immediately
    lenisRef.current.start();

    // GSAP ScrollTrigger integration
    if (gsapLoaded && scrollTriggerRef.current) {
      // Update ScrollTrigger on scroll
      lenisRef.current.on("scroll", scrollTriggerRef.current.update);
    }

    // Set ready state after a small delay to ensure everything is initialized
    const readyTimeout = setTimeout(() => {
      setIsReady(true);
    //   console.log("Lenis is ready");
    }, 100);

    // Auto RAF setup with ScrollTrigger integration
    if (autoRaf) {
      const raf = (time: number) => {
        lenisRef.current?.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      };
      rafIdRef.current = requestAnimationFrame(raf);
    }

    // Add className if provided
    if (className && root) {
      document.documentElement.classList.add(className);
    }

    // Cleanup function
    return () => {
      clearTimeout(readyTimeout);

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      if (className && root) {
        document.documentElement.classList.remove(className);
      }

      // Remove ScrollTrigger listener
      if (lenisRef.current && scrollTriggerRef.current) {
        lenisRef.current.off("scroll", scrollTriggerRef.current.update);
      }

      lenisRef.current?.destroy();
      lenisRef.current = null;
      setIsReady(false);
    };
  }, [autoRaf, className, root, rafPriority, gsapLoaded, options]);

  const contextValue: LenisContextValue = {
    lenis: lenisRef.current,
    isReady,
  };

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
};
