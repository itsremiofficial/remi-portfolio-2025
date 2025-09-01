/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { cn } from "../../utils";

interface CursorFollowerProps {
  cursor: ReactNode;
  children: ReactNode;
  cursorWrapperClassName?: string;
}

const CursorFollower: React.FC<CursorFollowerProps> = ({
  cursor,
  children,
  cursorWrapperClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorWrapperRef = useRef<HTMLDivElement>(null);
  const innerAnimatedRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<SVGCircleElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [active, setActive] = useState(false);
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  // Recursive circle ref injection
  const injectBallRef = (node: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(node)) return node;
    const el = node as React.ReactElement<any>;
    const isCircle =
      el.type === "circle" ||
      el.props?.["data-cursor-ball"] ||
      el.props?.id === "cursor-ball";
    if (isCircle) return React.cloneElement(el, { ref: ballRef });
    if (el.props?.children) {
      return React.cloneElement(el, {
        children: React.Children.map(el.props.children, injectBallRef),
      });
    }
    return el;
  };
  const clonedCursor = injectBallRef(cursor);

  // Circle lookup
  useEffect(() => {
    if (ballRef.current || !innerAnimatedRef.current) return;
    const circle =
      innerAnimatedRef.current.querySelector("[data-cursor-ball]") ||
      innerAnimatedRef.current.querySelector("circle");
    if (circle instanceof SVGCircleElement) ballRef.current = circle;
  }, [cursor]);

  // Backdrop blur fallback (Safari / older) if user supplied a backdrop-blur class
  useEffect(() => {
    const el = innerAnimatedRef.current;
    if (!el) return;
    const hasBackdropClass = /\bbackdrop-blur\b|\bbackdrop-blur-/.test(
      el.className
    );
    if (hasBackdropClass) {
      // If browser lacks support, enforce styles
      const supports = CSS.supports?.("backdrop-filter", "blur(1px)");
      if (!supports) {
        el.style.backdropFilter = "blur(40px)";
        (el.style as any).WebkitBackdropFilter = "blur(40px)";
      }
      // Ensure semi-transparent background for blur visibility if none provided
      const computedBg = getComputedStyle(el).backgroundColor;
      if (
        !/rgba|hsla|\/\d+\)/.test(computedBg) &&
        computedBg === "rgba(0, 0, 0, 0)"
      ) {
        el.style.backgroundColor = "rgba(0,0,0,0.08)";
      }
    }
  }, [cursorWrapperClassName]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const initQuick = () => {
      if (!cursorWrapperRef.current) return;
      quickX.current ||= gsap.quickTo(cursorWrapperRef.current, "x", {
        duration: 1.2,
        ease: "power3.out",
      });
      quickY.current ||= gsap.quickTo(cursorWrapperRef.current, "y", {
        duration: 1.2,
        ease: "power3.out",
      });
    };

    const ensureTimeline = () => {
      if (timelineRef.current || !innerAnimatedRef.current) return;
      timelineRef.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power3.out" },
          onReverseComplete: () => {
            if (cursorWrapperRef.current) {
              cursorWrapperRef.current.style.transform =
                "translate3d(-9999px,-9999px,0)";
            }
          },
        })
        .fromTo(
          innerAnimatedRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.65 }
        );
    };

    const animateEnter = (e: PointerEvent) => {
      setActive(true);
      initQuick();
      ensureTimeline();
      if (cursorWrapperRef.current) {
        gsap.set(cursorWrapperRef.current, {
          x: e.clientX,
          y: e.clientY,
        });
      }
      if (innerAnimatedRef.current)
        gsap.set(innerAnimatedRef.current, { scale: 1 });
      timelineRef.current?.play();
    };

    const animateLeave = () => {
      setActive(false);
      if (!timelineRef.current) return;
      if (innerAnimatedRef.current) {
        gsap.killTweensOf(innerAnimatedRef.current, "scale");
        gsap.to(innerAnimatedRef.current, { scale: 1, duration: 0.2 });
      }
      timelineRef.current.reverse();
    };

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      initQuick();
      quickX.current?.(e.clientX);
      quickY.current?.(e.clientY);
    };

    const enlarge = () => {
      if (ballRef.current) {
        ballRef.current.style.transition =
          "r 0.6s cubic-bezier(0.55,0.06,0.68,0.19)";
        ballRef.current.setAttribute("r", "100");
      } else if (innerAnimatedRef.current) {
        gsap.to(innerAnimatedRef.current, {
          scale: 1.35,
          duration: 0.9,
          ease: "elastic.out(1,0.6)",
          overwrite: "auto",
        });
      }
    };
    const shrink = () => {
      if (ballRef.current) {
        ballRef.current.style.transition =
          "r 0.5s cubic-bezier(0.25,0.46,0.45,0.94)";
        ballRef.current.setAttribute("r", "8");
      } else if (innerAnimatedRef.current) {
        gsap.to(innerAnimatedRef.current, {
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    const delegateOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a")) enlarge();
    };
    const delegateOut = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a")) shrink();
    };

    root.addEventListener("pointerenter", animateEnter, { passive: true });
    root.addEventListener("pointerleave", animateLeave, { passive: true });
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerover", delegateOver, { passive: true });
    root.addEventListener("pointerout", delegateOut, { passive: true });

    return () => {
      root.removeEventListener("pointerenter", animateEnter);
      root.removeEventListener("pointerleave", animateLeave);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerover", delegateOver);
      root.removeEventListener("pointerout", delegateOut);
    };
  }, [active]);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={cursorWrapperRef}
        className="pointer-events-none fixed top-0 left-0 z-50 will-change-transform"
        style={{ transform: "translate3d(-9999px,-9999px,0)" }}
      >
        <div
          ref={innerAnimatedRef}
          className={cn(
            "translate-x-[-50%] translate-y-[-50%] will-change-[transform,opacity]",
            cursorWrapperClassName
          )}
        >
          {clonedCursor}
        </div>
      </div>
      {children}
    </div>
  );
};

export default CursorFollower;
