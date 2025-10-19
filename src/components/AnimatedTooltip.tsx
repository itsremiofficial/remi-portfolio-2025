import { useState, useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { cn } from "../utils";

// ===== CONSTANTS =====
const ANIMATION_CONFIG = {
  SHOW: {
    duration: 0.3,
    ease: "back.out(1.7)",
    from: { opacity: 0, y: 20, scale: 0.6 },
    to: { opacity: 1, y: 0, scale: 1 },
  },
  HIDE: {
    duration: 0.2,
    ease: "power2.in",
    to: { opacity: 0, y: 20, scale: 0.6 },
  },
  POSITION: {
    duration: 0.4,
    ease: "elastic.out(1, 0.8)",
  },
} as const;

// ===== TYPES =====
type AnimatedTooltipProps = {
  id: number;
  className?: string;
  mains: string;
  subs?: string;
  Children: ReactNode;
};

// ===== COMPONENT =====
const AnimatedTooltip = ({
  id,
  mains,
  subs,
  className,
  Children,
}: AnimatedTooltipProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [shouldRenderTooltip, setShouldRenderTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle tooltip visibility with animations
  useEffect(() => {
    if (hoveredIndex === id) {
      setShouldRenderTooltip(true);
    } else if (tooltipRef.current) {
      gsap.to(tooltipRef.current, {
        ...ANIMATION_CONFIG.HIDE.to,
        duration: ANIMATION_CONFIG.HIDE.duration,
        ease: ANIMATION_CONFIG.HIDE.ease,
        onComplete: () => setShouldRenderTooltip(false),
      });
    }
  }, [hoveredIndex, id]);

  // Animate tooltip entrance
  useEffect(() => {
    if (shouldRenderTooltip && tooltipRef.current) {
      gsap.fromTo(
        tooltipRef.current,
        ANIMATION_CONFIG.SHOW.from,
        {
          ...ANIMATION_CONFIG.SHOW.to,
          duration: ANIMATION_CONFIG.SHOW.duration,
          ease: ANIMATION_CONFIG.SHOW.ease,
        }
      );
    }
  }, [shouldRenderTooltip]);

  // Handle mouse movement for tooltip positioning
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tooltipRef.current) return;

    const halfWidth = event.currentTarget.offsetWidth / 2;
    const offsetX = event.nativeEvent.offsetX - halfWidth;
    const translateX = offsetX / 2;

    gsap.to(tooltipRef.current, {
      x: translateX,
      duration: ANIMATION_CONFIG.POSITION.duration,
      ease: ANIMATION_CONFIG.POSITION.ease,
    });
  };

  return (
    <div
      onMouseEnter={() => setHoveredIndex(id)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {shouldRenderTooltip && (
        <div
          ref={tooltipRef}
          style={{
            whiteSpace: "nowrap",
            position: "absolute",
            top: "-3.5rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className={cn(
            "absolute inset-0 h-max w-[calc(100%_+_2rem)] flex text-xs flex-col items-center justify-center rounded-xl z-50 shadow-xl px-4 py-2 overflow-hidden",
            "bg-white dark:bg-foreground border border-foreground/20 dark:border-border/10"
          )}
        >
          <div className="absolute inset-x-5 z-30 w-[50%] -bottom-1 bg-gradient-to-r from-transparent via-foreground/40 dark:via-background/25 to-transparent h-2 blur-xs rounded-[100%]" />
          <div className="absolute left-5 w-[50%] z-30 bottom-0 bg-gradient-to-r from-transparent via-foreground/50 dark:via-background/25 to-transparent h-px" />
          <div className="font-medium text-foreground dark:text-background relative z-30 text-base flex items-center">
            {mains}
            {subs && (
              <div className="text-xs bg-primary dark:bg-white/5 dark:text-primary-700 px-2 py-1 rounded-md ml-2">
                {subs}
              </div>
            )}
          </div>
        </div>
      )}
      <div
        ref={contentRef}
        className={className}
        onMouseMove={handleMouseMove}
      >
        {Children}
      </div>
    </div>
  );
};

export default AnimatedTooltip;
