import { Suspense, useEffect, useRef, useState, memo, useCallback, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import CameraOrbit from "./CameraOrbit";
import TexturedSphere from "./TexturedSphere";
import ReadyPing from "./ReadyPing";
import { useTheme } from "../../hooks/useTheme";
import { clearTextureCache } from "./textureUtils";

interface PreLoaderProps {
  onComplete?: () => void;
}

/**
 * PreLoader Component
 *
 * Timeline:
 * 0.0s - Page loads, resources start loading (fonts, window, textures)
 * 1.0s - Sphere starts animating up (from TexturedSphere component)
 * 2.3s - Counter fades in and shows progress
 * [All resources loaded + minimum 300ms + 500ms buffer]
 * +0.0s - Counter fades out
 * +0.3s - exitTrigger set (PreLoader div starts fading out)
 * +0.8s - Canvas unmounts (WebGL context freed immediately)
 * +1.2s - Spheres animate down (exit animation from TexturedSphere)
 * +4.0s - onComplete callback fires
 * +4.1s - PreLoader unmounts, main content mounts and fades in
 */
const PreLoader = ({ onComplete }: PreLoaderProps) => {
  const counterRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const canvasTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedExitRef = useRef(false);
  const hasUnmountedCanvasRef = useRef(false); // Prevent canvas from reappearing
  const loadingStartTimeRef = useRef<number>(Date.now());

  const [progress, setProgress] = useState(0);
  const [exitTrigger, setExitTrigger] = useState(false);
  const [canvasState, setCanvasState] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  // Loading state tracking
  const [loadingStates, setLoadingStates] = useState({
    fonts: false,
    window: false,
    textures: false,
  });

  const { isDark } = useTheme();

  // Cache window width check - computed once
  const isDesktop = useMemo(() => window.innerWidth > 1100, []);

  // Memoize background color
  const backgroundColor = useMemo(() => isDark ? "#1c222f" : "#ece9e1", [isDark]);

  // Track fonts loading
  useEffect(() => {
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        setLoadingStates(prev => ({ ...prev, fonts: true }));
      });
    } else {
      // Fallback for browsers without font loading API
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, fonts: true }));
      }, 500);
    }
  }, []);

  // Track window load (all images, scripts, stylesheets)
  useEffect(() => {
    const handleLoad = () => {
      setLoadingStates(prev => ({ ...prev, window: true }));
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Memoize ready callback for textures
  const handleTexturesReady = useCallback(() => {
    setLoadingStates(prev => ({ ...prev, textures: true }));
  }, []);

  // Calculate loading progress based on loaded resources
  useEffect(() => {
    const loadedCount = Object.values(loadingStates).filter(Boolean).length;
    const totalResources = Object.keys(loadingStates).length;
    const calculatedProgress = Math.round((loadedCount / totalResources) * 100);
    setProgress(calculatedProgress);
  }, [loadingStates]);

  // Check if all resources are loaded
  const allResourcesLoaded = useMemo(() => {
    return loadingStates.fonts && loadingStates.window && loadingStates.textures;
  }, [loadingStates]);

  // Start animation sequence when all resources are loaded + minimum 300ms
  useEffect(() => {
    if (allResourcesLoaded && !hasStartedExitRef.current) {
      hasStartedExitRef.current = true;

      // Calculate minimum loading time (300ms)
      const elapsedTime = Date.now() - loadingStartTimeRef.current;
      const minimumLoadingTime = 300;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      // Sphere entrance animation: starts at 1000ms, duration 2500ms = completes at 3500ms
      // We need to wait until sphere animation completes before starting exit
      // Add extra time to let user see the sphere
      const sphereAnimationTime = 3500; // Sphere completes at 3.5s
      const extraViewTime = 500; // Let user see the sphere for 0.5s more
      const minimumTotalTime = sphereAnimationTime + extraViewTime; // 4000ms total

      // Use the longer of: minimum loading time or sphere animation time
      const actualWaitTime = Math.max(remainingTime + 500, minimumTotalTime - elapsedTime);

      // Wait for sphere animation to complete before starting exit
      const timer = setTimeout(() => {
        setIsReady(true);
      }, actualWaitTime);

      return () => clearTimeout(timer);
    }
  }, [allResourcesLoaded]);

  // Progress counter animation - appears AFTER sphere
  useEffect(() => {
    if (!counterRef.current) return;

    // Show counter after sphere has appeared (sphere delay is 1s, sphere duration is 2.5s)
    // Counter appears at 2.3s so it's visible after sphere is mostly visible
    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.to(counterRef.current, {
      opacity: 1,
      duration: 0.6,
      delay: 2.3 // Sphere appears at 1s, counter appears at 2.3s
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Exit sequence when ready
  useEffect(() => {
    if (!isReady) return;

    const tl = gsap.timeline();

    // Fade out counter
    tl.to(counterRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      onComplete: () => {
        setExitTrigger(true);

        // Wait for sphere exit animation to complete (1.2s) before fading out PreLoader div
        // This ensures spheres are visible while animating upward
        setTimeout(() => {
          setShouldFadeOut(true);
        }, 1400); // 1.2s animation + 200ms buffer

        // NOTE: Canvas unmounting is now handled in handleExitComplete
        // after the full exit timeline completes (not on a timer)
      },
    });

    return () => {
      tl.kill();
      if (canvasTimeoutRef.current) {
        clearTimeout(canvasTimeoutRef.current);
      }
    };
  }, [isReady]);

  // Cleanup on unmount - clear texture cache and prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear all cached textures when PreLoader unmounts
      clearTextureCache();

      // Kill any remaining timelines
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Handle exit complete callback
  const handleExitComplete = useCallback(() => {
    // Unmount Canvas now that exit animation is complete
    hasUnmountedCanvasRef.current = true;
    setCanvasState(false);

    // Call parent onComplete callback to show main content
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  return (
    <div
      className="loader fixed top-0 left-0 w-full h-screen z-[100000] pointer-events-none"
      style={{
        opacity: shouldFadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        visibility: shouldFadeOut ? 'hidden' : 'visible'
      }}
    >
      {canvasState && !hasUnmountedCanvasRef.current && (
        <Canvas
          key="preloader-canvas" // Unique key to ensure proper cleanup
          camera={{ position: [0, 0, 6], fov: 50 }}
          className="pointer-events-none"
          frameloop="always" // Keep rendering for animations
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={[1, 2]} // Limit pixel ratio to prevent memory issues
          onCreated={({ gl }) => {
            // Disable shader error checking for performance
            gl.debug.checkShaderErrors = false;

            // Handle context loss (expected on unmount - suppress warning)
            gl.domElement.addEventListener('webglcontextlost', (event) => {
              event.preventDefault();
              // Context loss on unmount is expected, don't log
            });
          }}
        >
          <color attach="background" args={[backgroundColor]} />
          <Suspense fallback={null}>
            <ReadyPing onReady={handleTexturesReady} />
            {isDesktop ? <CameraOrbit /> : null}
            <TexturedSphere exitTrigger={exitTrigger} onExitComplete={handleExitComplete} />
          </Suspense>
        </Canvas>
      )}

      <div
        ref={counterRef}
        className="absolute left-1/2 -translate-x-1/2 font-bold text-[26px] leading-[77%] tracking-wider uppercase opacity-0
                   bottom-[250px]
                   max-[1900px]:max-h-[700px]:min-w-[1100px]:bottom-[100px]
                   max-lg:bottom-[10px] max-lg:text-[18px] text-foreground text-mono"
      >
        {progress}%
      </div>
    </div>
  );
};

export default memo(PreLoader);
