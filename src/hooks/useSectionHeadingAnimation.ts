import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// ── Defaults ────────────────────────────────────────────────────────────────
const DEFAULTS = {
  start: "top 80%",
  end: "top 30%",
  scrub: 0.6,
  stagger: 0.15,
  offsetPercent: 12,
  rotationX: -45,
  blur: 10,
  perspective: 1000,
} as const;

// ── Types ───────────────────────────────────────────────────────────────────
export interface SectionHeadingAnimationOptions {
  /** ScrollTrigger start position (default: "top 80%"). */
  start?: string;
  /** ScrollTrigger end position (default: "top 30%"). */
  end?: string;
  /** ScrollTrigger scrub value (default: 0.6). */
  scrub?: number;
  /** Stagger between target elements (default: 0.15). */
  stagger?: number;
  /** Initial x/y offset percent (default: 12). */
  offsetPercent?: number;
  /** Initial rotationX in degrees (default: -45). */
  rotationX?: number;
  /** Initial blur in px (default: 10). */
  blur?: number;
  /** Transform perspective (default: 1000). */
  perspective?: number;
}

/**
 * Shared GSAP scroll-triggered heading animation.
 *
 * Returns a `scopeRef` — attach it to the wrapper element that contains
 * all `targetRefs`. The targets themselves are passed as an array of refs.
 *
 * @example
 * ```tsx
 * const scopeRef = useSectionHeadingAnimation(
 *   [headingRef, subheadingRef, descRef],
 *   { stagger: 0.1 },
 * );
 * return <div ref={scopeRef}>…</div>;
 * ```
 */
export function useSectionHeadingAnimation(
  targetRefs: React.RefObject<HTMLElement | null>[],
  options: SectionHeadingAnimationOptions = {},
) {
  const scopeRef = useRef<HTMLDivElement>(null);

  const {
    start = DEFAULTS.start,
    end = DEFAULTS.end,
    scrub = DEFAULTS.scrub,
    stagger = DEFAULTS.stagger,
    offsetPercent = DEFAULTS.offsetPercent,
    rotationX = DEFAULTS.rotationX,
    blur = DEFAULTS.blur,
    perspective = DEFAULTS.perspective,
  } = options;

  useGSAP(
    () => {
      const scope = scopeRef.current;
      const targets = targetRefs
        .map((r) => r.current)
        .filter(Boolean) as HTMLElement[];

      if (!scope || targets.length === 0) return;

      const mm = gsap.matchMedia();

      // Reduced motion — static display
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          clearProps: "transform",
        });
      });

      // Full motion — animated
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        targets.forEach((el) => el.classList.add("will-change-transform"));

        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: scope,
              start,
              end,
              scrub,
            },
            defaults: { ease: "power1.inOut" },
            onComplete: () => {
              targets.forEach((el) =>
                el.classList.remove("will-change-transform"),
              );
            },
          })
          .fromTo(
            targets,
            {
              autoAlpha: 0,
              xPercent: offsetPercent,
              yPercent: offsetPercent,
              filter: `blur(${blur}px)`,
              rotationX,
              transformPerspective: perspective,
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              rotationX: 0,
              filter: "blur(0px)",
              stagger,
            },
          );

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return scopeRef;
}
