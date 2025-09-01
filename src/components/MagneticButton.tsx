/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";
import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "../utils";

const HIDDEN_Y = "76%";
const ZOOM_HIDDEN_Y = "-76%";
const HOVER_DELAY = 50;

declare global {
  interface Window {
    __magneticCurrentHovered?: HTMLElement | null;
  }
}

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  fillClassName?: string;
  onClick?: () => void;
  dataStrength?: number;
  dataStrengthText?: number;
  isZoomDetail?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  fillClassName = "",
  onClick,
  dataStrength = 100,
  dataStrengthText = 50,
  isZoomDetail = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCurrentHovered = useCallback(
    () => window.__magneticCurrentHovered || null,
    []
  );
  const setGlobalCurrentHovered = useCallback((el: HTMLElement | null) => {
    window.__magneticCurrentHovered = el;
  }, []);

  const isMobile = () => window.innerWidth <= 540;

  // Helper: set hidden state
  const setFillHidden = useCallback(
    (fill: HTMLElement) => {
      if (isZoomDetail) {
        gsap.set(fill, {
          y: ZOOM_HIDDEN_Y,
          background: "transparent",
          immediateRender: true,
        });
      } else {
        gsap.set(fill, { y: HIDDEN_Y });
      }
    },
    [isZoomDetail]
  );

  // Helper: animate fill
  const animateFill = useCallback((toY: string, opts?: gsap.TweenVars) => {
    const fill = fillRef.current;
    if (!fill) return;
    gsap.to(fill, {
      duration: 0.5,
      y: toY,
      ease: "0.7, 0, 0.2, 1",
      overwrite: "auto",
      ...opts,
    });
  }, []);

  // Initialize / update fill when zoom mode changes
  useEffect(() => {
    if (fillRef.current) setFillHidden(fillRef.current);
  }, [setFillHidden]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isMobile() || !buttonRef.current || !textRef.current) return;

      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();

      const buttonX =
        ((e.clientX - rect.left) / button.offsetWidth - 0.5) * dataStrength;
      const buttonY =
        ((e.clientY - rect.top) / button.offsetHeight - 0.5) * dataStrength;
      const textX =
        ((e.clientX - rect.left) / button.offsetWidth - 0.5) * dataStrengthText;
      const textY =
        ((e.clientY - rect.top) / button.offsetHeight - 0.5) * dataStrengthText;

      gsap.to(button, {
        duration: 1.5,
        x: buttonX,
        y: buttonY,
        rotate: "0.001deg",
        ease: "power4.out",
      });

      gsap.to(textRef.current, {
        duration: 1.5,
        x: textX,
        y: textY,
        rotate: "0.001deg",
        ease: "power4.out",
      });
    },
    [dataStrength, dataStrengthText]
  );

  const handleMouseLeave = useCallback(() => {
    if (isMobile() || !buttonRef.current || !textRef.current) return;

    gsap.to(buttonRef.current, {
      duration: 1.5,
      x: 0,
      y: 0,
      ease: "elastic.out",
    });

    gsap.to(textRef.current, {
      duration: 1.5,
      x: 0,
      y: 0,
      ease: "elastic.out",
    });
  }, []);

  const handlePointerEnter = useCallback(() => {
    if (isMobile() || !buttonRef.current || !fillRef.current) return;

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    const prevBtn = getCurrentHovered();
    if (prevBtn && prevBtn !== buttonRef.current) {
      const prevFill = prevBtn.querySelector(".btn-fill") as HTMLElement | null;
      if (prevFill) {
        gsap.killTweensOf(prevFill);
        gsap.to(prevFill, {
          duration: 0.6,
          y: HIDDEN_Y,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    }

    setGlobalCurrentHovered(buttonRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      const fill = fillRef.current;
      if (!fill) return;
      gsap.killTweensOf(fill);
      if (isZoomDetail) {
        setFillHidden(fill);
        return;
      }
      // Force restart from 76% (below) to 0%
      gsap.fromTo(
        fill,
        { y: HIDDEN_Y },
        {
          duration: 0.5,
          y: "0%",
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }, HOVER_DELAY);
  }, [getCurrentHovered, setGlobalCurrentHovered, isZoomDetail, setFillHidden]);

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (isMobile() || !buttonRef.current || !fillRef.current) return;
      if (
        e.pointerType === "mouse" &&
        buttonRef.current.contains(e.relatedTarget as Node)
      )
        return;

      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

      const fill = fillRef.current;
      gsap.killTweensOf(fill);

      if (isZoomDetail) {
        setFillHidden(fill);
      } else {
        // Animate upward out of view to -76%
        gsap.to(fill, {
          duration: 0.5,
          y: ZOOM_HIDDEN_Y,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }

      if (getCurrentHovered() === buttonRef.current) {
        setGlobalCurrentHovered(null);
      }
    },
    [getCurrentHovered, setGlobalCurrentHovered, isZoomDetail, setFillHidden]
  );

  useEffect(() => {
    const btnEl = buttonRef.current;
    const textEl = textRef.current;
    const fillEl = fillRef.current;
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      gsap.killTweensOf([btnEl, textEl, fillEl]);
      if (getCurrentHovered() === btnEl) setGlobalCurrentHovered(null);
    };
  }, [getCurrentHovered, setGlobalCurrentHovered]);

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden hashover magnetic ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={fillRef}
        className={cn(
          "btn-fill absolute left-0 top-[-50%] rounded-[50%] w-[110%] h-[200%] pointer-events-none",
          fillClassName
        )}
        style={{
          transform: `translateY(${isZoomDetail ? ZOOM_HIDDEN_Y : HIDDEN_Y})`,
        }}
      />
      <span ref={textRef} className="btn-text relative z-10 inline-block">
        {children}
      </span>
    </button>
  );
};

export default MagneticButton;

/**
 * MagneticButton Use Cases
 *
 * 1. Basic usage
 *    <MagneticButton>Explore</MagneticButton>
 *
 * 2. Custom color (CSS variable or hex)
 *    <MagneticButton dataColor="var(--brand-accent)">Contact</MagneticButton>
 *    <MagneticButton dataColor="#ff6a00">Hire Me</MagneticButton>
 *
 * 3. Adjust magnetic strength (outer button vs text)
 *    <MagneticButton dataStrength={140} dataStrengthText={60}>Play</MagneticButton>
 *    Lower numbers = subtler motion.
 *
 * 4. Zoom detail mode (no fill animation, stays transparent)
 *    <MagneticButton isZoomDetail>Close</MagneticButton>
 *
 * 5. Custom fill shape / color via class
 *    <MagneticButton fillClassName="bg-gradient-to-br from-fuchsia-500 to-cyan-400">Buy</MagneticButton>
 *
 * 6. With onClick handler
 *    <MagneticButton onClick={() => openModal()}>Open Modal</MagneticButton>
 *
 * 7. In a grid / list (safe for multiple instances; global hover tracking prevents overlap)
 *    {items.map(i => (
 *      <MagneticButton key={i.id} dataColor={i.color}>{i.label}</MagneticButton>
 *    ))}
 *
 * 8. Accessible label for icon-only usage
 *    <MagneticButton aria-label="Open settings">
 *      <SettingsIcon />
 *    </MagneticButton>
 *
 * 9. Prevent layout shift: wrap in fixed-size container if parent flow is sensitive
 *    <div className="w-32 h-32">
 *      <MagneticButton className="w-full h-full">Go</MagneticButton>
 *    </div>
 *
 * 10. Conditional mobile fallback (magnetic disabled under 540px automatically)
 *     <MagneticButton>Tap Me</MagneticButton>
 *
 * 11. Theming using Tailwind + dataColor override
 *     <MagneticButton dataColor="hsl(var(--primary))" className="text-primary-foreground">
 *       Primary Action
 *     </MagneticButton>
 *
 * 12. Mixing with motion libraries (avoid conflicting transforms)
 *     Wrap in parent: <motion.div whileInView={{ opacity: 1 }}><MagneticButton>View</MagneticButton></motion.div>
 *
 * 13. Programmatic focus (ref usage)
 *     const ref = useRef<HTMLButtonElement>(null);
 *     <MagneticButton ref={ref}>Focus</MagneticButton>
 *     ref.current?.focus();
 *
 * 14. Safety: Fill layer is pointer-events-none so clicks always register on button.
 *
 * 15. SSR note: All DOM-dependent logic gated by event callbacks; safe in Next.js.
 *
 * 16. Performance tips:
 *     - Avoid wrapping in frequently re-rendering parents.
 *     - Keep text concise to reduce repaint area.
 *
 * 17. Disabling magnetic effect externally (pattern):
 *     const isReduced = useReducedMotion(); // custom hook
 *     return <MagneticButton dataStrength={isReduced ? 0 : 120}>Motion Aware</MagneticButton>
 *
 * 18. Different inward vs outward feel:
 *     Smaller text strength relative to button (e.g., 160 vs 40) exaggerates parallax.
 *
 * 19. Transparent idle fill but colored on hover:
 *     Provide dataColor only; internal logic sets background before animating.
 *
 * 20. Edge case handling:
 *     Rapid pointer transitions between multiple buttons resets previous fill gracefully.
 */
