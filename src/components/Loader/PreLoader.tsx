/**
 * PreLoader Component
 *
 * Minimal loading screen with a percentage counter that scales
 * from 10vw → 90vw as resources load, positioned at bottom-left.
 * Slides up smoothly once loading completes.
 */

import { useEffect, useRef, useState, memo, useMemo } from "react";
import gsap from "gsap";
import { useTheme } from "../../hooks/useTheme";

// ===== TYPES =====
interface PreLoaderProps {
  onComplete?: () => void;
}

// ===== CONSTANTS =====
const MIN_FONT_VW = 10;
const MAX_FONT_VW = 40;
const MIN_DISPLAY_MS = 2000;

// ===== COMPONENT =====
const PreLoader = ({ onComplete }: PreLoaderProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const displayedProgress = useRef({ value: 0 });
  const hasStartedExitRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const [progress, setProgress] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    fonts: false,
    window: false,
  });
  const [shouldUnmount, setShouldUnmount] = useState(false);

  const { isDark } = useTheme();
  const backgroundColor = useMemo(
    () => (isDark ? "#161c26" : "#e3e1d8"),
    [isDark],
  );

  // ===== RESOURCE TRACKING =====
  useEffect(() => {
    if ("fonts" in document) {
      document.fonts.ready.then(() =>
        setLoadingStates((prev) => ({ ...prev, fonts: true })),
      );
    } else {
      setTimeout(
        () => setLoadingStates((prev) => ({ ...prev, fonts: true })),
        500,
      );
    }
  }, []);

  useEffect(() => {
    const onLoad = () =>
      setLoadingStates((prev) => ({ ...prev, window: true }));
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Calculate progress
  useEffect(() => {
    const loaded = Object.values(loadingStates).filter(Boolean).length;
    const total = Object.keys(loadingStates).length;
    setProgress(Math.round((loaded / total) * 100));
  }, [loadingStates]);

  const allLoaded = useMemo(
    () => Object.values(loadingStates).every(Boolean),
    [loadingStates],
  );

  // ===== ANIMATE COUNTER (font-size 10vw → 90vw) =====
  useEffect(() => {
    if (!counterRef.current) return;

    const tween = gsap.to(displayedProgress.current, {
      value: progress,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        if (!counterRef.current || !numberRef.current) return;
        const val = Math.round(displayedProgress.current.value);
        const fontSize =
          MIN_FONT_VW + (MAX_FONT_VW - MIN_FONT_VW) * (val / 100);
        numberRef.current.textContent = `${val}`;
        counterRef.current.style.fontSize = `${fontSize}vw`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [progress]);

  // ===== EXIT SEQUENCE =====
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Trigger exit after loading + minimum display time
  useEffect(() => {
    if (!allLoaded || hasStartedExitRef.current) return;
    hasStartedExitRef.current = true;

    const elapsed = Date.now() - startTimeRef.current;
    const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);

    const timer = setTimeout(() => {
      // Wait a beat for the counter tween to finish reaching 100
      setTimeout(() => {
        if (!overlayRef.current || !counterRef.current) return;

        const tl = gsap.timeline();

        // Fade out counter
        tl.to(counterRef.current, {
          opacity: 0,
          scale: 1.05,
          duration: 0.4,
          ease: "power2.in",
        });

        // Slide overlay up
        tl.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete: () => {
            onCompleteRef.current?.();
            setShouldUnmount(true);
          },
        });
      }, 900); // allow counter tween (0.8s) to finish
    }, delay);

    return () => clearTimeout(timer);
  }, [allLoaded]);

  // ===== RENDER =====
  if (shouldUnmount) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Counter — bottom-left, scales 10vw → 90vw */}
      <div
        ref={counterRef}
        className="absolute bottom-0 left-0 font-robo font-var uppercase leading-[0.8] text-foreground dark:text-background pl-4 pb-2 select-none"
        style={{
          fontSize: `${MIN_FONT_VW}vw`,
          transformOrigin: "bottom left",
        }}
      >
        <span ref={numberRef}>0</span>
        <span className="">%</span>
      </div>
    </div>
  );
};

export default memo(PreLoader);
