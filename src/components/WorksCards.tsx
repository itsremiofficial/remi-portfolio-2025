/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
import { useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WORKS from "../constants/WORKS";
import gsap from "gsap";
import { Observer } from "gsap/all";
import horizontalLoop from "../utils/horizontalLoop";

// Physics constants
const DRAG_SENSITIVITY = 0.005;
const DRAG_LERP = 0.18;
const INERTIA_LERP = 0.18;
const VELOCITY_SMOOTH = 0.4;
const INERTIA_FRICTION = 0.92;
const INERTIA_MIN_V = 0.005;
const VELOCITY_EFFECT_MULT = 95;

const WHEEL_SENSITIVITY = 0.004;
const WHEEL_VELOCITY_MULT = 0.0018;
const WHEEL_LERP = 0.18;
const WHEEL_FRICTION = 0.9;
const WHEEL_MIN_V = 0.0005;

// Interaction constants
const DRAG_THRESHOLD = 5;
const MAX_PARALLAX_OFFSET = 120;
const BASE_PARALLAX_OFFSET = 40;

// Utility
const clamp = (min: number, max: number, v: number) =>
  Math.min(max, Math.max(min, v));

const WorksCards = () => {
  // Container that the user drags (outer) & the actual horizontal wrapper (inner)
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const loopRef = useRef<any>(null);

  // Drag / pointer refs
  const touchStartRef = useRef(0);
  const touchXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const dragStartedRef = useRef(false);
  const prevTimeRef = useRef(0);

  // Playback refs
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const inertiaRef = useRef(false);
  const velocityRef = useRef(0);
  const smoothedVelocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  // Gating refs
  const fontsReadyRef = useRef(false);
  const inViewRef = useRef(false);
  const imagesReadyRef = useRef(false); // NEW: wait for images
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const directionRef = useRef(1);
  const wheelActiveRef = useRef(false);
  const wheelVelocityRef = useRef(0);

  // Position-based parallax targets
  const parallaxTargetsRef = useRef<
    {
      img: HTMLImageElement;
      host: HTMLElement;
      depth: number;
      setX: (v: number) => void;
    }[]
  >([]);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // NEW: consider device mobile if touch-capable or UA hints at mobile/tablet
  const isMobileDevice =
    typeof window !== "undefined" &&
    (isTouch ||
      /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ));

  // Single flag to disable animations on mobile or when reduced motion is set
  const disableAnimations = reduceMotion || isMobileDevice;

  const lerp = useCallback(
    (v0: number, v1: number, t: number) => v0 * (1 - t) + v1 * t,
    []
  );

  // Helper: order cards by current on-screen x position to keep loop continuity
  const getOrderedCards = useCallback(() => {
    return cardRefs.current
      .filter(Boolean)
      .slice()
      .sort(
        (a, b) =>
          a.getBoundingClientRect().left - b.getBoundingClientRect().left
      );
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let cancelled = false;
    const imgs = Array.from(el.querySelectorAll("img"));
    if (imgs.length === 0) {
      imagesReadyRef.current = true;
      tryInit();
      return;
    }
    const waits = imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      if (typeof img.decode === "function") {
        return img.decode().catch(() => undefined);
      }
      return new Promise<void>((res) =>
        img.addEventListener("load", () => res(), { once: true })
      );
    });
    Promise.all(waits).then(() => {
      if (cancelled) return;
      imagesReadyRef.current = true;
      tryInit();
    });
    return () => {
      cancelled = true;
    };
  }, []);
  /* ---------- Intersection Observer (outer container) ---------- */
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        inViewRef.current = visible;
        if (visible) tryInit();
      },
      {
        threshold: 0,
        rootMargin: "200px 0px 200px 0px", // trigger early
      }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---------- Fonts Ready (guard older browsers) ---------- */
  useEffect(() => {
    let cancelled = false;
    if ((document as any).fonts?.ready) {
      (document as any).fonts.ready.then(() => {
        if (cancelled) return;
        fontsReadyRef.current = true;
        tryInit();
      });
    } else {
      // Fallback: assume fonts are fine after short delay
      setTimeout(() => {
        if (!cancelled) {
          fontsReadyRef.current = true;
          tryInit();
        }
      }, 300);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Safety Fallback (init anyway after 1.2s) ---------- */
  useEffect(() => {
    fallbackTimerRef.current = setTimeout(() => {
      if (!initializedRef.current) {
        fontsReadyRef.current = true;
        inViewRef.current = true;
        tryInit();
      }
    }, 1200);
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  /* ---------- Initialization ---------- */
  /* ---------- Initialization ---------- */
  const tryInit = useCallback(() => {
    if (initializedRef.current) return;
    if (!fontsReadyRef.current || !inViewRef.current || !imagesReadyRef.current)
      return; // include images
    if (!trackRef.current || cardRefs.current.length === 0) return;

    initializedRef.current = true;
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    // NEW: Disable animations on mobile or if reduced motion is preferred
    if (disableAnimations) {
      cardRefs.current.forEach((c) =>
        gsap.set(c, { transform: "none", clearProps: "all" })
      );
      return;
    }

    // Build the loop using the actual elements in on-screen order
    loopRef.current = horizontalLoop(getOrderedCards(), {
      repeat: -1,
      speed: 1.5,
    });

    // Collect images marked for parallax and prepare setters (position-based)
    if (trackRef.current) {
      const imgs = Array.from(
        trackRef.current.querySelectorAll<HTMLImageElement>(
          'img[data-parallax="true"]'
        )
      );
      parallaxTargetsRef.current = imgs.map((img) => {
        const depthAttr = parseFloat(img.getAttribute("data-depth") || "0.25");
        const depth = Number.isFinite(depthAttr) ? depthAttr : 0.25;
        // host: the card or nearest container that moves with the loop
        const host =
          (img.closest(".menu--item") as HTMLElement) ||
          (img.parentElement as HTMLElement) ||
          img;
        // quickSetter for immediate transform updates (perf)
        const setX = gsap.quickSetter(img, "x", "px") as (v: number) => void;
        return { img, host, depth, setX };
      });
    }

    loopRef.current.timeScale(directionRef.current).play();
    currentTimeRef.current = loopRef.current.time();
    targetTimeRef.current = currentTimeRef.current;
    prevTimeRef.current = currentTimeRef.current;

    attachDesktopWheel();
    attachPointer();

    startRAF();
  }, [disableAnimations, lerp, getOrderedCards]);

  // Rebuild loop on resize to keep spacing consistent after layout changes
  useEffect(() => {
    const onResize = () => {
      if (!loopRef.current || cardRefs.current.length === 0) return;
      // preserve current visual position
      const prevTime = loopRef.current.time();
      const wasPlaying =
        !!loopRef.current.isActive() ||
        (!isDraggingRef.current &&
          !inertiaRef.current &&
          !wheelActiveRef.current);

      loopRef.current.kill();
      loopRef.current = horizontalLoop(getOrderedCards(), {
        repeat: -1,
        speed: 1.5,
      });

      const dur = loopRef.current.totalDuration();
      const wrapped = ((prevTime % dur) + dur) % dur;
      loopRef.current.time(wrapped);
      if (wasPlaying) {
        loopRef.current.timeScale(directionRef.current).play();
      } else {
        loopRef.current.pause();
      }
    };

    // debounce to avoid thrashing
    let raf = 0;
    const debounced = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onResize);
    };

    window.addEventListener("resize", debounced);
    window.addEventListener("orientationchange", debounced);
    return () => {
      window.removeEventListener("resize", debounced);
      window.removeEventListener("orientationchange", debounced);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------- Wheel (desktop only) ---------- */
  const attachDesktopWheel = () => {
    if (isTouch) return; // skip wheel logic on touch devices
    Observer.create({
      target: window,
      type: "wheel",
      onChangeY: (self) => {
        if (!loopRef.current) return;
        if (isDraggingRef.current || inertiaRef.current) return;
        // Scroll down (deltaY > 0) = carousel moves right-to-left (positive direction)
        // Scroll up (deltaY < 0) = carousel moves left-to-right (negative direction)
        const factor = self.deltaY > 0 ? 1 : -1;

        if (!wheelActiveRef.current) {
          loopRef.current.pause();
          wheelActiveRef.current = true;
        }

        // Use factor to control scrolling and maintain direction for autoplay
        targetTimeRef.current +=
          Math.abs(self.deltaY) * WHEEL_SENSITIVITY * factor;
        wheelVelocityRef.current +=
          Math.abs(self.deltaY) * WHEEL_VELOCITY_MULT * factor;
        // Update direction to match scroll direction for consistent autoplay
        directionRef.current = factor;
      },
    });
  };

  const resumeAutoplay = () => {
    if (!loopRef.current) return;
    // Smoothly animate back to autoplay with the last interaction direction
    gsap.timeline().to(loopRef.current, {
      timeScale: 1.5 * directionRef.current,
      duration: 0.5,
      ease: "power2.out",
      onStart: () => loopRef.current?.play(),
    });
  };

  /* ---------- Pointer / Drag ---------- */
  const attachPointer = () => {
    const el = trackRef.current;
    if (!el) return;

    const handlePointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true;
      dragStartedRef.current = false;
      inertiaRef.current = false;
      velocityRef.current = 0;
      smoothedVelocityRef.current = 0;
      touchStartRef.current = e.clientX;
      touchXRef.current = e.clientX;
      // Pause autoplay immediately so drag feels responsive
      loopRef.current?.pause();
    };

    const startDrag = () => {
      if (dragStartedRef.current || !loopRef.current) return;
      dragStartedRef.current = true;
      isDraggingRef.current = true;
      el.classList.add("is-dragging");
      currentTimeRef.current = loopRef.current.time();
      targetTimeRef.current = currentTimeRef.current;
      prevTimeRef.current = currentTimeRef.current;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const x = e.clientX;
      const travel = x - touchStartRef.current;
      if (!dragStartedRef.current && Math.abs(travel) > DRAG_THRESHOLD) {
        startDrag();
        // Reset touchX to prevent accumulated threshold pixels from causing a jump
        touchXRef.current = x;
        return; // Skip this frame to avoid jump
      }
      if (!dragStartedRef.current) return;

      // IMPORTANT: prevent vertical scroll capture only while actively dragging:
      if (!isTouch) e.preventDefault();

      const deltaX = x - touchXRef.current;
      // reverse so drag direction matches visual motion
      targetTimeRef.current -= deltaX * DRAG_SENSITIVITY;
      if (deltaX !== 0) directionRef.current = deltaX < 0 ? 1 : -1;
      touchXRef.current = x;
    };

    const elasticReset = () => {
      gsap.to(cardRefs.current, {
        skewX: 0,
        rotate: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1,0.6)",
        overwrite: "auto",
      });
    };

    const endDrag = () => {
      if (dragStartedRef.current) {
        inertiaRef.current =
          Math.abs(smoothedVelocityRef.current) > INERTIA_MIN_V * 80;
        if (!inertiaRef.current) {
          elasticReset();
          resumeAutoplay();
        }
      }
      isPointerDownRef.current = false;
      isDraggingRef.current = false;
      dragStartedRef.current = false;
      el.classList.remove("is-dragging");
    };

    // Non-passive needed since we call preventDefault
    el.addEventListener("pointerdown", handlePointerDown, { passive: true });
    el.addEventListener("pointermove", handlePointerMove as any, {
      passive: false,
    });
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointerleave", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("selectstart", (ev) => {
      if (dragStartedRef.current) {
        ev.preventDefault();
        return false;
      }
      return undefined;
    });

    // Touch convenience: slight tap resumes autoplay if somehow paused
    el.addEventListener("click", () => {
      if (!isDraggingRef.current && !inertiaRef.current) resumeAutoplay();
    });
  };

  /* ---------- RAF Loop ---------- */
  const startRAF = () => {
    const render = () => {
      rafIdRef.current = requestAnimationFrame(render);
      if (!loopRef.current) return;

      if (isDraggingRef.current) {
        currentTimeRef.current = lerp(
          currentTimeRef.current,
          targetTimeRef.current,
          DRAG_LERP
        );
        const dur = loopRef.current.totalDuration();
        loopRef.current.time(((currentTimeRef.current % dur) + dur) % dur);

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
        gsap.set(cardRefs.current, {
          skewX,
          rotate,
          scale,
          willChange: "transform",
        });
      } else if (inertiaRef.current) {
        if (loopRef.current.isActive()) loopRef.current.pause();
        targetTimeRef.current += smoothedVelocityRef.current * 0.012;
        currentTimeRef.current = lerp(
          currentTimeRef.current,
          targetTimeRef.current,
          INERTIA_LERP
        );
        const dur = loopRef.current.totalDuration();
        loopRef.current.time(((currentTimeRef.current % dur) + dur) % dur);

        smoothedVelocityRef.current *= INERTIA_FRICTION;
        const skewX = clamp(-10, 10, -smoothedVelocityRef.current * 0.18);
        const rotate = clamp(-3, 3, smoothedVelocityRef.current * 0.02);
        const scale =
          1 - Math.min(0.12, Math.abs(smoothedVelocityRef.current) * 0.0012);
        gsap.set(cardRefs.current, {
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
          gsap.to(cardRefs.current, {
            skewX: 0,
            rotate: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
          resumeAutoplay();
        }
      } else if (wheelActiveRef.current) {
        currentTimeRef.current = lerp(
          currentTimeRef.current,
          targetTimeRef.current,
          WHEEL_LERP
        );
        const dur = loopRef.current.totalDuration();
        loopRef.current.time(((currentTimeRef.current % dur) + dur) % dur);

        targetTimeRef.current += wheelVelocityRef.current;
        wheelVelocityRef.current *= WHEEL_FRICTION;

        smoothedVelocityRef.current = lerp(
          smoothedVelocityRef.current,
          wheelVelocityRef.current * VELOCITY_EFFECT_MULT,
          VELOCITY_SMOOTH
        );
        const skewX = clamp(-8, 8, -smoothedVelocityRef.current * 0.18);
        const rotate = clamp(-3, 3, smoothedVelocityRef.current * 0.02);
        const scale =
          1 - Math.min(0.08, Math.abs(smoothedVelocityRef.current) * 0.0009);
        gsap.set(cardRefs.current, {
          skewX,
          rotate,
          scale,
          willChange: "transform",
        });

        if (
          Math.abs(wheelVelocityRef.current) < WHEEL_MIN_V &&
          Math.abs(targetTimeRef.current - currentTimeRef.current) < 0.001
        ) {
          wheelActiveRef.current = false;
          smoothedVelocityRef.current = 0;
          gsap.to(cardRefs.current, {
            skewX: 0,
            rotate: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
          resumeAutoplay();
        }
      } else {
        // Autoplay, keep prevTime in sync (no parallax calc needed here)
        const t = loopRef.current.time();
        prevTimeRef.current = t;
      }

      // Position-based parallax: offset by distance from viewport center
      if (parallaxTargetsRef.current.length) {
        const vpCenter = window.innerWidth / 2;
        const vpWidth = window.innerWidth;

        for (const { host, depth, setX } of parallaxTargetsRef.current) {
          const rect = host.getBoundingClientRect();
          const hostCenterX = rect.left + rect.width / 2;
          const deltaFromCenter = hostCenterX - vpCenter;

          // Normalize position: 0 at center, ±1 at edges
          const normalizedPos = clamp(-1, 1, deltaFromCenter / (vpWidth / 2));

          // Smooth ease-out curve: stronger near center, gentler at edges
          const easeMultiplier = 1 - Math.abs(normalizedPos) * 0.3;

          // Calculate smooth parallax with base + center boost
          const parallaxAmount =
            BASE_PARALLAX_OFFSET +
            (MAX_PARALLAX_OFFSET - BASE_PARALLAX_OFFSET) * easeMultiplier;
          const offset = clamp(
            -MAX_PARALLAX_OFFSET,
            MAX_PARALLAX_OFFSET,
            -normalizedPos * parallaxAmount * depth
          );

          setX(offset);
        }
      }
    };
    render();
  };

  /* ---------- Cleanup on Unmount ---------- */
  useEffect(
    () => () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (loopRef.current) {
        loopRef.current.kill();
        loopRef.current = null;
      }
      // Reset parallax translations
      if (parallaxTargetsRef.current.length) {
        gsap.set(
          parallaxTargetsRef.current.map((t) => t.img),
          { x: 0 }
        );
      }
    },
    []
  );

  const navigate = useNavigate();

  return (
    <div
      ref={outerRef}
      className="menu flex items-center justify-center select-none my-4 lg:my-28 min-h-[30vh] lg:min-h-[40vh]"
    >
      <div
        ref={trackRef}
        className="menu--wrapper flex justify-start cursor-grab"
        style={{
          touchAction: isTouch ? "pan-y" : "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {WORKS.map(({ title, imageUrl, year, type, slug, id }, index) => (
          <div
            key={id}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            className="menu--item m-4 marquee-works-card flex-shrink-0"
          >
            <div
              onClick={() => navigate(`/work/${slug}`)}
              className="relative space-x-20 cursor-pointer"
            >
              <div className="absolute right-0 top-2 flex items-center justify-center rounded-full w-6 md:w-8 lg:w-14 h-1/3">
                <div className="flex items-center gap-2 rotate-270 text-foreground dark:text-background text-md md:text-lg lg:text-3xl leading-none font-robo font-extrabold whitespace-nowrap">
                  <div className="rotate-180 text-accent">
                    <span>❮</span>
                    <span className="relative -left-1">❮</span>
                    <span className="relative -left-2">❮</span>
                  </div>
                  <div>© {year}</div>
                </div>
              </div>

              <div className="relative works-card-clip flex items-center justify-center !aspect-[16/10] pointer-events-none select-none">
                <img
                  src={imageUrl}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="size-full scale-120 object-cover select-none pointer-events-none will-change-transform"
                  draggable={false}
                  data-parallax="true"
                  data-depth="1.2"
                />
              </div>

              <div className="absolute text-xl md:text-2xl lg:text-4xl left-2 md:left-6 bottom-0 md:bottom-3 lg:bottom-5 flex inverted-card-bottom font-grandbold tracking-widest text-foreground dark:text-background uppercase">
                {title}
              </div>
              <div className="absolute left-0 top-0 pb-2 flex items-center justify-center text-foreground dark:text-background text-xs md:text-sm lg:text-lg font-robo font-extrabold uppercase leading-none w-28 lg:w-36 pt-1 lg:pt-2.5">
                {type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksCards;
