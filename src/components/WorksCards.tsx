/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback, useEffect } from "react";
import WORKS from "../constants/WORKS";
import gsap from "gsap";
import { Observer } from "gsap/all";
import horizontalLoop from "../utils/horizontalLoop";

gsap.registerPlugin(Observer);

const DRAG_SENSITIVITY = 0.012; // lower for smoother control (px -> timeline units)
const DRAG_LERP = 0.18; // how fast currentTime chases target during drag
const INERTIA_LERP = 0.12; // lerp during inertia
const VELOCITY_SMOOTH = 0.4; // smoothing factor for velocity
const INERTIA_FRICTION = 0.92; // decay each frame
const INERTIA_MIN_V = 0.005; // stop threshold (timeline units/frame)
const VELOCITY_EFFECT_MULT = 95; // scale raw timeline delta to expressive transform range
const WHEEL_SENSITIVITY = 0.004; // wheel delta -> timeline units
const WHEEL_VELOCITY_MULT = 0.0018; // scales immediate velocity injection
const WHEEL_LERP = 0.14;
const WHEEL_FRICTION = 0.9;
const WHEEL_MIN_V = 0.0005; // stop threshold for wheel
const clamp = (min: number, max: number, v: number) =>
  Math.min(max, Math.max(min, v));

const WorksCards = () => {
  const worksContainerRef = useRef<HTMLDivElement>(null);
  const worksCardRef = useRef<HTMLDivElement[]>([]);
  const loopRef = useRef<any>(null);

  // Use refs for touch positions to avoid state updates during drag
  const touchStartRef = useRef(0);
  const touchXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const dragStartedRef = useRef(false);
  const prevTimeRef = useRef(0); // for velocity
  const dragThreshold = 5; // px before we treat it as a drag

  // Refs for lerp
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);

  // Add new refs (place near other refs)
  const inertiaRef = useRef(false);
  const velocityRef = useRef(0);
  const smoothedVelocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const initializedRef = useRef(false);
  const fontsReadyRef = useRef(false);
  const inViewRef = useRef(false);
  const directionRef = useRef(1); // 1 forward, -1 backward
  const wheelActiveRef = useRef(false);
  const wheelVelocityRef = useRef(0);

  // Lerp function for smooth interpolation
  const lerp = useCallback((v0: number, v1: number, t: number): number => {
    return v0 * (1 - t) + v1 * t;
  }, []);

  // IntersectionObserver for lazy init
  useEffect(() => {
    const el = worksContainerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          inViewRef.current = true;
          tryInit();
        } else {
          inViewRef.current = false;
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Wait for fonts (once)
  useEffect(() => {
    document.fonts.ready.then(() => {
      fontsReadyRef.current = true;
      tryInit();
    });
  }, []);

  // Initialization wrapper (lazy)
  const tryInit = useCallback(() => {
    if (initializedRef.current) return;
    if (!fontsReadyRef.current) return;
    if (!inViewRef.current) return;
    if (!worksContainerRef.current || worksCardRef.current.length === 0) return;

    const worksContainer = worksContainerRef.current;

    // const speed = 13;
    // Create loop
    loopRef.current = horizontalLoop(".marquee-works-card", {
      repeat: -1,
      speed: 1.5,
    });
    loopRef.current.timeScale(directionRef.current).play();

    currentTimeRef.current = loopRef.current.time();
    targetTimeRef.current = currentTimeRef.current;
    prevTimeRef.current = currentTimeRef.current;
    initializedRef.current = true;

    // REMOVE previous wheel timeScale tween logic and replace with velocity-based wheel control:
    Observer.create({
      target: window,
      type: "wheel",
      onChangeY: (self) => {
        if (!loopRef.current) return;
        if (isDraggingRef.current || inertiaRef.current) return;

        // Normalize wheel delta: negative deltaY (scroll up) -> forward, positive -> backward
        const delta = -self.deltaY; // invert for natural horizontal feel
        if (!wheelActiveRef.current) {
          // Enter wheel control: pause autoplay, snapshot state
          loopRef.current.pause();
          wheelActiveRef.current = true;
        }

        // Accumulate target time & velocity
        targetTimeRef.current += delta * WHEEL_SENSITIVITY;
        wheelVelocityRef.current += delta * WHEEL_VELOCITY_MULT;

        // Set intended autoplay direction based on delta sign
        if (delta !== 0) directionRef.current = delta > 0 ? 1 : -1;
      },
    });

    const resumeAutoplay = () => {
      if (!loopRef.current) return;
      loopRef.current.timeScale(directionRef.current).play();
    };

    /* Pointer / Drag Logic */
    const handlePointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true;
      dragStartedRef.current = false;
      inertiaRef.current = false;
      velocityRef.current = 0;
      smoothedVelocityRef.current = 0;
      touchStartRef.current = e.clientX;
      touchXRef.current = e.clientX;
    };

    const startDrag = () => {
      if (dragStartedRef.current || !loopRef.current) return;
      dragStartedRef.current = true;
      isDraggingRef.current = true;
      worksContainer.classList.add("is-dragging");
      loopRef.current.pause();
      currentTimeRef.current = loopRef.current.time();
      targetTimeRef.current = currentTimeRef.current;
      prevTimeRef.current = currentTimeRef.current;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const x = e.clientX;
      const travel = x - touchStartRef.current;
      if (!dragStartedRef.current && Math.abs(travel) > dragThreshold)
        startDrag();
      if (!dragStartedRef.current) return;
      e.preventDefault();
      const deltaX = x - touchXRef.current;
      // Invert back: increase timeline (forward) when dragging left (deltaX < 0) so content follows pointer
      targetTimeRef.current -= deltaX * DRAG_SENSITIVITY; // CHANGED (was +=)
      // Direction: if user drags left (deltaX < 0) we want autoplay forward (1); drag right -> reverse (-1)
      if (deltaX !== 0) {
        directionRef.current = deltaX < 0 ? 1 : -1;
      }
      touchXRef.current = x;
    };

    const applyElasticReset = () => {
      gsap.to(worksCardRef.current, {
        skewX: 0,
        rotate: 0,
        scale: 1,
        duration: 0.9,
        ease: "elastic.out(1,0.6)",
        overwrite: "auto",
      });
    };

    const endDrag = () => {
      if (dragStartedRef.current) {
        // start inertia if velocity meaningful
        inertiaRef.current =
          Math.abs(smoothedVelocityRef.current) > INERTIA_MIN_V;
        if (!inertiaRef.current && loopRef.current) {
          resumeAutoplay();
          applyElasticReset();
        }
      }
      isPointerDownRef.current = false;
      isDraggingRef.current = false;
      dragStartedRef.current = false;
      worksContainer.classList.remove("is-dragging");
    };

    const handlePointerUp = () => endDrag();
    const handlePointerLeave = () => endDrag();
    const handlePointerCancel = () => endDrag();

    worksContainer.addEventListener("pointerdown", handlePointerDown);
    worksContainer.addEventListener("pointermove", handlePointerMove);
    worksContainer.addEventListener("pointerup", handlePointerUp);
    worksContainer.addEventListener("pointerleave", handlePointerLeave);
    worksContainer.addEventListener("pointercancel", handlePointerCancel);
    worksContainer.addEventListener("selectstart", (e) => {
      if (dragStartedRef.current) e.preventDefault();
      return false;
    });

    /* RAF Render */
    const render = () => {
      rafIdRef.current = requestAnimationFrame(render);
      if (!loopRef.current) return;

      if (isDraggingRef.current) {
        currentTimeRef.current = lerp(
          currentTimeRef.current,
          targetTimeRef.current,
          DRAG_LERP
        );
        const duration = loopRef.current.totalDuration();
        loopRef.current.time(currentTimeRef.current % duration);

        const rawDelta = currentTimeRef.current - prevTimeRef.current;
        prevTimeRef.current = currentTimeRef.current;

        velocityRef.current = rawDelta;
        smoothedVelocityRef.current = lerp(
          smoothedVelocityRef.current,
          velocityRef.current * VELOCITY_EFFECT_MULT,
          VELOCITY_SMOOTH
        );

        const skewX = clamp(-14, 14, -smoothedVelocityRef.current * 0.25);
        const rotate = clamp(-4, 4, smoothedVelocityRef.current * 0.03);
        const scale =
          1 - Math.min(0.18, Math.abs(smoothedVelocityRef.current) * 0.0018);

        gsap.set(worksCardRef.current, {
          skewX,
          rotate,
          scale,
          willChange: "transform",
        });
      } else if (inertiaRef.current) {
        // Inertia phase (manual control)
        if (loopRef.current.isActive()) loopRef.current.pause();
        // advance using velocity
        targetTimeRef.current += smoothedVelocityRef.current * 0.012;
        currentTimeRef.current = lerp(
          currentTimeRef.current,
          targetTimeRef.current,
          INERTIA_LERP
        );
        const duration = loopRef.current.totalDuration();
        loopRef.current.time(
          ((currentTimeRef.current % duration) + duration) % duration
        );

        // friction decay
        smoothedVelocityRef.current *= INERTIA_FRICTION;

        const skewX = clamp(-10, 10, -smoothedVelocityRef.current * 0.18);
        const rotate = clamp(-3, 3, smoothedVelocityRef.current * 0.02);
        const scale =
          1 - Math.min(0.12, Math.abs(smoothedVelocityRef.current) * 0.0012);
        gsap.set(worksCardRef.current, {
          skewX,
          rotate,
          scale,
          willChange: "transform",
        });

        if (
          Math.abs(smoothedVelocityRef.current) <
          INERTIA_MIN_V * VELOCITY_EFFECT_MULT
        ) {
          inertiaRef.current = false;
          applyElasticReset();
          resumeAutoplay();
        }
      } else if (wheelActiveRef.current) {
        // Wheel smoothing phase
        currentTimeRef.current = lerp(
          currentTimeRef.current,
          targetTimeRef.current,
          WHEEL_LERP
        );

        const duration = loopRef.current.totalDuration();
        loopRef.current.time(
          ((currentTimeRef.current % duration) + duration) % duration
        );

        // Advance target by residual velocity (gives momentum)
        targetTimeRef.current += wheelVelocityRef.current;

        // Decay velocity
        wheelVelocityRef.current *= WHEEL_FRICTION;

        // Subtle transform feedback (reuse smoothedVelocityRef for consistency)
        smoothedVelocityRef.current = lerp(
          smoothedVelocityRef.current,
          wheelVelocityRef.current * VELOCITY_EFFECT_MULT,
          VELOCITY_SMOOTH
        );
        const skewX = clamp(-8, 8, -smoothedVelocityRef.current * 0.18);
        const rotate = clamp(-3, 3, smoothedVelocityRef.current * 0.02);
        const scale =
          1 - Math.min(0.08, Math.abs(smoothedVelocityRef.current) * 0.0009);
        gsap.set(worksCardRef.current, {
          skewX,
          rotate,
          scale,
          willChange: "transform",
        });

        // End wheel phase -> resume autoplay
        if (
          Math.abs(wheelVelocityRef.current) < WHEEL_MIN_V &&
          Math.abs(targetTimeRef.current - currentTimeRef.current) < 0.001
        ) {
          wheelActiveRef.current = false;
          smoothedVelocityRef.current = 0;
          gsap.to(worksCardRef.current, {
            skewX: 0,
            rotate: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
          resumeAutoplay();
        }
      }
    };
    render();

    // Cleanup for this initialization
    const cleanup = () => {
      worksContainer.removeEventListener("pointerdown", handlePointerDown);
      worksContainer.removeEventListener("pointermove", handlePointerMove);
      worksContainer.removeEventListener("pointerup", handlePointerUp);
      worksContainer.removeEventListener("pointerleave", handlePointerLeave);
      worksContainer.removeEventListener("pointercancel", handlePointerCancel);
      worksContainer.removeEventListener("selectstart", () => false);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (loopRef.current) {
        loopRef.current.kill();
        loopRef.current = null;
      }
    };
    // Store cleanup on ref to allow external future use if needed
    (tryInit as any).cleanup = cleanup;
  }, [lerp]);

  return (
    <div
      // ref={worksContainerRef}
      className="menu flex items-center justify-center cursor-pointer active:cursor-grabbing select-none my-28"
    >
      <div
        className="menu--wrapper flex justify-start"
        ref={worksContainerRef}
        style={{ touchAction: "none" }}
      >
        {WORKS.map(({ title, imageUrl }, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) worksCardRef.current[index] = el;
            }}
            className="menu--item m-4 marquee-works-card flex-shrink-0"
          >
            <div className="relative space-x-20">
              <div className="absolute right-0 top-2 flex items-center justify-center rounded-full w-6 md:w-8 lg:w-14 h-1/3">
                <div className="flex items-center gap-2 rotate-270 text-foreground dark:text-background text-md md:text-lg lg:text-3xl leading-none font-robo font-extrabold whitespace-nowrap">
                  <div className="rotate-180 text-accent">
                    <span>❮</span>
                    <span className="relative -left-1">❮</span>
                    <span className="relative -left-2">❮</span>
                  </div>
                  <div>© 2023</div>
                </div>
              </div>
              <div className="relative box-inverted flex items-center justify-center !aspect-[16/10]">
                <img
                  src={imageUrl}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover select-none pointer-events-none"
                />
              </div>
              <div className="absolute text-xl md:text-2xl lg:text-4xl left-[1.5vw] bottom-0 flex inverted-card-bottom font-nippo uppercase font-extrabold text-foreground dark:text-background tracking-tight lg:py-4">
                {title}
              </div>
              <div className="absolute left-0 top-0 pl-2 pb-2 flex items-center justify-center text-foreground dark:text-background text-2xl md:text-4xl lg:text-7xl font-nippo font-extrabold">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksCards;
