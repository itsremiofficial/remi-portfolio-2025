/**
 * PreLoader Component
 *
 * A sophisticated loading screen featuring animated 3D spheres and resource tracking.
 * Displays a percentage counter while loading fonts, window resources, and textures.
 *
 * Features:
 * - Resource tracking (fonts, window load, 3D textures)
 * - Animated 3D spheres with entrance and exit animations
 * - Progress counter with smooth fade in/out
 * - Smooth crossfade transition to main content
 * - Proper WebGL context management and cleanup
 * - Memory-efficient texture caching
 *
 * Animation Timeline:
 * 1. Spheres enter from bottom (1s delay + 2.5s animation)
 * 2. Progress counter fades in at 2.3s
 * 3. When resources load, counter fades out
 * 4. Spheres exit upward (1.2s animation)
 * 5. PreLoader fades out while main content animates in
 */

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
  useMemo,
} from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import CameraOrbit from "./CameraOrbit";
import TexturedSphere from "./TexturedSphere";
import ReadyPing from "./ReadyPing";
import { useTheme } from "../../hooks/useTheme";
import { clearTextureCache } from "./textureUtils";

// ===== TYPES =====
interface PreLoaderProps {
  onComplete?: () => void;
}

// ===== COMPONENT =====

const PreLoader = ({ onComplete }: PreLoaderProps) => {
  // ===== REFS =====
  const counterRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const canvasTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedExitRef = useRef(false);
  const hasUnmountedCanvasRef = useRef(false);
  const loadingStartTimeRef = useRef<number>(Date.now());

  // ===== STATE =====
  // Loading progress state
  const [progress, setProgress] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    fonts: false,
    window: false,
    textures: false,
  });

  // Animation sequence state
  const [exitTrigger, setExitTrigger] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [_startWaveAnimation, setStartWaveAnimation] = useState(false);

  // Canvas lifecycle state
  const [canvasState, setCanvasState] = useState(true);
  const [shouldUnmount, setShouldUnmount] = useState(false);

  // ===== COMPUTED VALUES =====
  const { isDark } = useTheme();
  const isDesktop = useMemo(() => window.innerWidth > 1100, []);
  const backgroundColor = useMemo(
    () => (isDark ? "#161c26" : "#e3e1d8"),
    [isDark],
  );

  // ===== CALLBACKS =====
  const handleTexturesReady = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, textures: true }));
  }, []);

  const handleExitComplete = useCallback(() => {
    // Trigger main content appearance immediately
    if (onComplete) {
      onComplete();
    }

    // Unmount Canvas after short delay for smooth transition
    setTimeout(() => {
      hasUnmountedCanvasRef.current = true;
      setCanvasState(false);
    }, 500);

    // Fully unmount PreLoader after fade-out completes
    setTimeout(() => {
      setShouldUnmount(true);
    }, 2200);
  }, [onComplete]);

  // ===== RESOURCE TRACKING EFFECTS =====
  // Track font loading
  useEffect(() => {
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        setLoadingStates((prev) => ({ ...prev, fonts: true }));
      });
    } else {
      setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, fonts: true }));
      }, 500);
    }
  }, []);

  // Track window load (images, scripts, stylesheets)
  useEffect(() => {
    const handleLoad = () => {
      setLoadingStates((prev) => ({ ...prev, window: true }));
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Calculate loading progress percentage
  useEffect(() => {
    const loadedCount = Object.values(loadingStates).filter(Boolean).length;
    const totalResources = Object.keys(loadingStates).length;
    const calculatedProgress = Math.round((loadedCount / totalResources) * 100);
    setProgress(calculatedProgress);
  }, [loadingStates]);

  // Check if all resources are loaded
  const allResourcesLoaded = useMemo(() => {
    return (
      loadingStates.fonts && loadingStates.window && loadingStates.textures
    );
  }, [loadingStates]);

  // ===== ANIMATION SEQUENCE EFFECTS =====
  // Trigger exit sequence when all resources load (after minimum display time)
  useEffect(() => {
    if (allResourcesLoaded && !hasStartedExitRef.current) {
      hasStartedExitRef.current = true;

      const elapsedTime = Date.now() - loadingStartTimeRef.current;
      const minimumLoadingTime = 300;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      // Sphere entrance: 1s delay + 2.5s animation = completes at 3.5s
      // Add 500ms viewing time = 4s total minimum
      const sphereAnimationTime = 3500;
      const extraViewTime = 500;
      const minimumTotalTime = sphereAnimationTime + extraViewTime;

      const actualWaitTime = Math.max(
        remainingTime + 500,
        minimumTotalTime - elapsedTime,
      );

      const timer = setTimeout(() => {
        setIsReady(true);
      }, actualWaitTime);

      return () => clearTimeout(timer);
    }
  }, [allResourcesLoaded]);

  // Fade in progress counter after sphere appears
  useEffect(() => {
    if (!counterRef.current) return;

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Counter appears at 2.3s (after sphere is mostly visible)
    tl.to(counterRef.current, {
      opacity: 1,
      duration: 0.6,
      delay: 2.3,
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Exit sequence - fade out counter and trigger sphere exit
  useEffect(() => {
    if (!isReady) return;

    const tl = gsap.timeline();

    tl.to(counterRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      onComplete: () => {
        setExitTrigger(true);
        setStartWaveAnimation(true);

        // Delay PreLoader fade-out until spheres finish animating (1.2s + 200ms buffer)
        const timeoutId = setTimeout(() => {
          setShouldFadeOut(true);
        }, 1400);

        canvasTimeoutRef.current = timeoutId;
      },
    });

    return () => {
      tl.kill();
      const timeoutId = canvasTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isReady]);

  // ===== CLEANUP EFFECT =====
  useEffect(() => {
    return () => {
      clearTextureCache();
      timelineRef.current?.kill();
    };
  }, []);

  // ===== RENDER =====
  // Unmount after fade-out completes to free resources
  if (shouldUnmount) {
    return null;
  }

  return (
    <div
      className="loader fixed top-0 left-0 w-full h-screen z-[100000] pointer-events-none"
      style={{
        opacity: shouldFadeOut ? 0 : 1,
        transition: "opacity 0.8s ease-out",
        visibility: shouldFadeOut ? "hidden" : "visible",
        pointerEvents: "none",
      }}
    >
      {/* 3D Canvas - renders animated spheres */}
      <div className="w-full h-full flex items-center justify-center relative">
        {canvasState && !hasUnmountedCanvasRef.current && (
          <Canvas
            key="preloader-canvas"
            camera={{ position: [0, 0, 6], fov: 50 }}
            className="pointer-events-none relative z-10"
            frameloop="always"
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false,
            }}
            dpr={[1, 2]}
            onCreated={({ gl }) => {
              gl.debug.checkShaderErrors = false;
              gl.domElement.addEventListener("webglcontextlost", (event) => {
                event.preventDefault();
              });
            }}
          >
            <color attach="background" args={[backgroundColor]} />
            <Suspense fallback={null}>
              <ReadyPing onReady={handleTexturesReady} />
              {isDesktop && <CameraOrbit />}
              <TexturedSphere
                exitTrigger={exitTrigger}
                onExitComplete={handleExitComplete}
              />
            </Suspense>
          </Canvas>
        )}

        {/* Progress Counter */}
        <div
          ref={counterRef}
          className="absolute left-1/2 -translate-x-1/2 font-bold text-[26px] leading-[77%] tracking-wider uppercase opacity-0 bottom-[250px] max-[1900px]:max-h-[700px]:min-w-[1100px]:bottom-[100px] max-lg:bottom-[10px] max-lg:text-[18px] text-foreground dark:text-background text-mono z-20"
        >
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default memo(PreLoader);
