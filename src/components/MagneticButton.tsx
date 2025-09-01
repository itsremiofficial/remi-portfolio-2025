// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useRef, useEffect, type MouseEvent } from "react";
// import { cn } from "../utils";

// interface MagneticButtonProps {
//   href?: string;
//   children: React.ReactNode;
//   strength?: number;
//   strengthText?: number;
//   onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
//   target?: string;
//   buttonClassName?: string;
//   textClassName?: string;
//   [key: string]: any; // For other HTML attributes
// }

// interface Transform {
//   x: number;
//   y: number;
// }

// const MagneticButton = ({
//   href,
//   children,
//   strength = 25,
//   strengthText = 15,
//   textClassName,
//   buttonClassName,
//   onClick,
//   target,
//   ...props
// }: MagneticButtonProps) => {
//   const [magneticTransform, setMagneticTransform] = useState<Transform>({
//     x: 0,
//     y: 0,
//   });
//   const [textTransform, setTextTransform] = useState<Transform>({ x: 0, y: 0 });
//   const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   // NEW STATE FOR FILL ANIMATION
//   const [fillPhase, setFillPhase] = useState<"initial" | "hover" | "exit">(
//     "initial"
//   );
//   const [fillResetting, setFillResetting] = useState(false);
//   const fillTimeoutRef = useRef<number | null>(null);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 540);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);

//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (fillTimeoutRef.current) window.clearTimeout(fillTimeoutRef.current);
//     };
//   }, []);

//   const handleMouseMove = (
//     e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
//   ) => {
//     if (isMobile || !buttonRef.current) return;

//     const button = buttonRef.current;
//     const bounding = button.getBoundingClientRect();

//     const x =
//       ((e.clientX - bounding.left) / button.offsetWidth - 0.5) * strength;
//     const y =
//       ((e.clientY - bounding.top) / button.offsetHeight - 0.5) * strength;

//     const textX =
//       ((e.clientX - bounding.left) / button.offsetWidth - 0.5) * strengthText;
//     const textY =
//       ((e.clientY - bounding.top) / button.offsetHeight - 0.5) * strengthText;

//     setMagneticTransform({ x, y });
//     setTextTransform({ x: textX, y: textY });
//   };

//   const handleMouseEnter = () => {
//     if (fillTimeoutRef.current) window.clearTimeout(fillTimeoutRef.current);
//     setFillResetting(false);
//     setFillPhase("hover");
//   };

//   const handleMouseLeave = () => {
//     setMagneticTransform({ x: 0, y: 0 });
//     setTextTransform({ x: 0, y: 0 });
//     setFillPhase("exit"); // animate to -76%
//     if (fillTimeoutRef.current) window.clearTimeout(fillTimeoutRef.current);
//     fillTimeoutRef.current = window.setTimeout(() => {
//       // disable transition to jump back below
//       setFillResetting(true);
//       setFillPhase("initial"); // returns to 76% instantly
//       requestAnimationFrame(() => {
//         // re-enable transition for next interaction
//         setFillResetting(false);
//       });
//     }, 600); // match duration-600
//   };

//   const handleClick = (
//     e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
//   ) => {
//     if (onClick) {
//       e.preventDefault();
//       onClick(e);
//     }
//   };

//   const fillBaseClasses =
//     "absolute top-[-50%] left-[-25%] right-0 bottom-0 w-[150%] h-[200%] rounded-[50%] z-[1] bg-foreground dark:bg-background";
//   const fillTransitionClasses = fillResetting
//     ? "transition-none"
//     : "transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]";
//   const fillY =
//     fillPhase === "initial" ? "76%" : fillPhase === "hover" ? "0%" : "-76%";

//   const textStyle = [
//     "relative z-20 flex items-center gap-2",
//     `transform translate-x-[var(--tx)] translate-y-[var(--ty)] rotate-[0.001deg]`,
//     isMobile
//       ? "transition-none"
//       : "transition-transform duration-[1500ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
//   ];

//   const textInnerStyle = [
//     "dark:text-background text-foreground group-hover:text-accent",
//     "transition-colors ease-[cubic-bezier(0.4,0,0.2,1)]",
//     "duration-300 delay-300 group-hover:delay-0",
//     "flex items-center gap-2 justify-center w-full",
//   ];

//   const buttonStyle = [
//     "inline-block relative text-decoration-none rounded-full bg-transparent cursor-pointer font-medium overflow-hidden border border-foreground dark:border-background ",
//     "group-hover:border-foreground transition-all duration-300",
//     `transform translate-x-[var(--btx)] translate-y-[var(--bty)] rotate-[0.001deg]`,
//     isMobile
//       ? "transition-none"
//       : "transition-transform duration-[1500ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
//   ];

//   const buttonContent = (
//     <>
//       <div
//         className={cn("btn-fill", fillBaseClasses, fillTransitionClasses)}
//         style={{ transform: `translateY(${fillY})` }}
//       />
//       <span
//         className={cn("btn-text", textStyle)}
//         style={
//           {
//             "--tx": `${textTransform.x}px`,
//             "--ty": `${textTransform.y}px`,
//           } as React.CSSProperties
//         }
//       >
//         <span
//           className={cn("btn-text-inner change", textInnerStyle, textClassName)}
//         >
//           {children}
//         </span>
//       </span>
//     </>
//   );

//   if (href) {
//     return (
//       <div className={cn(`btn btn-normal group`)}>
//         <a
//           ref={buttonRef as React.RefObject<HTMLAnchorElement>}
//           href={href}
//           target={target}
//           className={cn(
//             "btn-click magnetic whitespace-nowrap border py-5 px-10",
//             buttonStyle,
//             buttonClassName
//           )}
//           data-strength={strength}
//           data-strength-text={strengthText}
//           onMouseMove={handleMouseMove as any}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           onClick={handleClick as any}
//           style={
//             {
//               "--btx": `${magneticTransform.x}px`,
//               "--bty": `${magneticTransform.y}px`,
//             } as React.CSSProperties
//           }
//           {...props}
//         >
//           {buttonContent}
//         </a>
//       </div>
//     );
//   }

//   return (
//     <div className={`btn btn-normal group`}>
//       <button
//         ref={buttonRef as React.RefObject<HTMLButtonElement>}
//         className={cn(
//           "btn-click magnetic whitespace-nowrap border py-5 px-10",
//           buttonStyle,
//           buttonClassName
//         )}
//         style={
//           {
//             "--btx": `${magneticTransform.x}px`,
//             "--bty": `${magneticTransform.y}px`,
//           } as React.CSSProperties
//         }
//         data-strength={strength}
//         data-strength-text={strengthText}
//         onMouseMove={handleMouseMove}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onClick={onClick as any}
//         {...props}
//       >
//         {buttonContent}
//       </button>
//     </div>
//   );
// };

// export default MagneticButton;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useRef,
  useEffect,
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "../utils";

/**
 * MagneticCircleButton usage examples:
 *
 * Basic:
 * <MagneticCircleButton>
 *   <span>Click Me</span>
 * </MagneticCircleButton>
 *
 * Custom size + styling:
 * <MagneticCircleButton
 *   size={180}
 *   className="bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
 *   textClassName="text-lg tracking-wide"
 * >
 *   Launch
 * </MagneticCircleButton>
 *
 * As anchor:
 * <MagneticCircleButton
 *   href="https://example.com"
 *   target="_blank"
 *   rel="noreferrer"
 *   className="border-blue-500 text-blue-500"
 * >
 *   Docs
 * </MagneticCircleButton>
 *
 * Fine‑tuning physics:
 * <MagneticCircleButton
 *   radius={200}
 *   strengthButton={0.6}
 *   strengthText={0.25}
 *   frictionActive={0.2}
 *   frictionIdle={0.1}
 *   springReturn={0.22}
 *   damping={0.75}
 * >
 *   Smooth
 * </MagneticCircleButton>
 *
 * Multiple (auto‑optimized global loop):
 * <div className="flex gap-6 flex-wrap">
 *   {['One','Two','Three'].map(lbl => (
 *     <MagneticCircleButton key={lbl} size={120}>{lbl}</MagneticCircleButton>
 *   ))}
 * </div>
 *
 * Disabled state:
 * <MagneticCircleButton disabled className="opacity-40">
 *   Disabled
 * </MagneticCircleButton>
 *
 * Using `as` to render a different element (e.g. div with role=button):
 * <MagneticCircleButton as="div" role="button" tabIndex={0}>
 *   Div Button
 * </MagneticCircleButton>
 *
 * Notes:
 * - Only transform styles are mutated per frame (GPU-friendly).
 * - A single RAF + pointer listener is shared across all instances.
 * - Supply custom focus styles via className as desired.
 */

// ---- Global registry & loop (shared among all instances) ----
interface InstanceConfig {
  el: HTMLElement;
  inner: HTMLElement;
  opts: OptionsResolved;
  state: {
    bx: number;
    by: number;
    tx: number;
    ty: number;
    bvx: number;
    bvy: number;
    tvx: number;
    tvy: number;
    active: boolean;
    rect: DOMRect | null;
    rectAge: number;
  };
}

const instances: InstanceConfig[] = [];
let pointerX = -99999;
let pointerY = -99999;
let rafId: number | null = null;
let pointerListenerAttached = false;
let resizeObserver: ResizeObserver | null = null;

interface OptionsResolved {
  radius: number;
  strengthButton: number;
  strengthText: number;
  frictionActive: number;
  frictionIdle: number;
  springReturn: number;
  damping: number;
  rectTTL: number;
}

const defaultOptions: OptionsResolved = {
  radius: 150,
  strengthButton: 0.5,
  strengthText: 0.2,
  frictionActive: 0.18,
  frictionIdle: 0.12,
  springReturn: 0.18,
  damping: 0.72,
  rectTTL: 120, // ms before re-measuring rect for perf
};

function ensurePointerListener() {
  if (pointerListenerAttached) return;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    },
    { passive: true }
  );
  pointerListenerAttached = true;
}

function ensureResizeObserver() {
  if (resizeObserver) return;
  resizeObserver = new ResizeObserver((entries) => {
    const ts = performance.now();
    for (const entry of entries) {
      instances.forEach((inst) => {
        if (inst.el === entry.target) {
          inst.state.rect = inst.el.getBoundingClientRect();
          inst.state.rectAge = ts;
        }
      });
    }
  });
}

function startLoop() {
  if (rafId != null) return;
  const frame = (t: number) => {
    for (const inst of instances) {
      const {
        el,
        inner,
        opts,
        state: { bx, by, tx, ty, bvx, bvy, tvx, tvy, active, rect, rectAge },
        state,
      } = inst;

      const now = t;
      // Refresh rect if stale
      if (!rect || now - rectAge > opts.rectTTL) {
        state.rect = el.getBoundingClientRect();
        state.rectAge = now;
      }
      if (!state.rect) continue;
      const r = state.rect;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = pointerX - cx;
      const dy = pointerY - cy;
      const dist = Math.hypot(dx, dy);
      const within = dist < opts.radius;

      if (within) {
        state.active = true;
        // Target positions
        const targetBX = dx * opts.strengthButton;
        const targetBY = dy * opts.strengthButton;
        const targetTX = dx * opts.strengthText;
        const targetTY = dy * opts.strengthText;

        const f = opts.frictionActive;
        state.bx = bx + (targetBX - bx) * f;
        state.by = by + (targetBY - by) * f;
        state.tx = tx + (targetTX - tx) * f;
        state.ty = ty + (targetTY - ty) * f;
        // Reset return velocities
        state.bvx = state.bvy = state.tvx = state.tvy = 0;
      } else {
        // Spring back smoothly
        state.active = false;
        // Button spring
        state.bvx = state.bvx * opts.damping + (0 - bx) * opts.springReturn;
        state.bvy = state.bvy * opts.damping + (0 - by) * opts.springReturn;
        state.bx = bx + state.bvx;
        state.by = by + state.bvy;
        // Text spring (slightly faster return with frictionIdle)
        const fi = opts.frictionIdle;
        state.tx = tx + (0 - tx) * fi;
        state.ty = ty + (0 - ty) * fi;
      }

      el.style.transform = `translate3d(${state.bx}px,${state.by}px,0)`;
      inner.style.transform = `translate3d(${state.tx}px,${state.ty}px,0)`;
    }

    if (instances.length === 0) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(frame);
  };
  rafId = requestAnimationFrame(frame);
}

function stopLoopIfIdle() {
  if (instances.length === 0 && rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

// ---- Component ----
type BaseProps = {
  children: React.ReactNode;
  radius?: number;
  strengthButton?: number;
  strengthText?: number;
  frictionActive?: number;
  frictionIdle?: number;
  springReturn?: number;
  damping?: number;
  size?: number;
  as?: ElementType;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
} & (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
) &
  HTMLAttributes<HTMLElement>;

const MagneticButton = forwardRef<HTMLElement, BaseProps>(
  (
    {
      children,
      radius,
      strengthButton,
      strengthText,
      frictionActive,
      frictionIdle,
      springReturn,
      damping,
      size = 150,
      as,
      className,
      textClassName,
      disabled,
      href,
      ...rest
    },
    ref
  ) => {
    const outerRef = useRef<HTMLElement | null>(null);
    const textRef = useRef<HTMLSpanElement | null>(null);

    // Expose ref
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") ref(outerRef.current);
      else
        (ref as React.MutableRefObject<HTMLElement | null>).current =
          outerRef.current;
    }, [ref]);

    useEffect(() => {
      if (disabled) return;
      const el = outerRef.current;
      const inner = textRef.current;
      if (!el || !inner) return;

      ensurePointerListener();
      ensureResizeObserver();
      resizeObserver?.observe(el);

      const opts: OptionsResolved = {
        radius: radius ?? defaultOptions.radius,
        strengthButton: strengthButton ?? defaultOptions.strengthButton,
        strengthText: strengthText ?? defaultOptions.strengthText,
        frictionActive: frictionActive ?? defaultOptions.frictionActive,
        frictionIdle: frictionIdle ?? defaultOptions.frictionIdle,
        springReturn: springReturn ?? defaultOptions.springReturn,
        damping: damping ?? defaultOptions.damping,
        rectTTL: defaultOptions.rectTTL,
      };

      const inst: InstanceConfig = {
        el: el as HTMLElement,
        inner,
        opts,
        state: {
          bx: 0,
          by: 0,
          tx: 0,
          ty: 0,
          bvx: 0,
          bvy: 0,
          tvx: 0,
          tvy: 0,
          active: false,
          rect: null,
          rectAge: 0,
        },
      };
      instances.push(inst);
      startLoop();

      return () => {
        const idx = instances.indexOf(inst);
        if (idx >= 0) instances.splice(idx, 1);
        stopLoopIfIdle();
        resizeObserver?.unobserve(el);
      };
    }, [
      disabled,
      radius,
      strengthButton,
      strengthText,
      frictionActive,
      frictionIdle,
      springReturn,
      damping,
    ]);

    const Tag: any = as ? as : href ? "a" : "button";

    return (
      <Tag
        ref={outerRef}
        href={href}
        type={!href ? "button" : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          "magnetic-circle-btn relative inline-flex items-center justify-center rounded-full select-none",
          "font-semibold border border-current overflow-hidden",
          "transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        style={{
          width: size,
          height: size,
          lineHeight: 1,
          // initial transform (will be updated)
          transform: "translate3d(0,0,0)",
          // Force its own layer
          willChange: "transform",
        }}
        {...rest}
      >
        <span
          ref={textRef}
          className={cn(
            "pointer-events-none will-change-transform inline-block",
            textClassName
          )}
          style={{
            transform: "translate3d(0,0,0)",
          }}
        >
          {children}
        </span>
      </Tag>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
