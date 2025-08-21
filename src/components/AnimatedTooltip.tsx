import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

type AnimatedTooltipProps = {
  id: number;
  className?: string;
  mains: string;
  subs?: string;
  Children: React.ReactNode;
};

const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  id,
  mains,
  subs,
  className,
  Children,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [shouldRenderTooltip, setShouldRenderTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle showing and hiding the tooltip
  useEffect(() => {
    if (hoveredIndex === id) {
      // Show tooltip
      setShouldRenderTooltip(true);
    } else if (tooltipRef.current) {
      // Hide tooltip with animation, then unmount
      gsap.to(tooltipRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.6,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setShouldRenderTooltip(false),
      });
    }
  }, [hoveredIndex, id]);

  // Animate in when tooltip is rendered
  useEffect(() => {
    if (shouldRenderTooltip && tooltipRef.current) {
      gsap.fromTo(
        tooltipRef.current,
        { opacity: 0, y: 20, scale: 0.6 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [shouldRenderTooltip]);

  // Handle mouse movement for tooltip position
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tooltipRef.current) return;

    const halfWidth = event.currentTarget.offsetWidth / 2;
    const offsetX = event.nativeEvent.offsetX - halfWidth;

    // Map the mouse position to translate value
    const translateX = offsetX / 2;

    gsap.to(tooltipRef.current, {
      x: translateX,
      duration: 0.4,
      ease: "elastic.out(1, 0.8)", // Similar to spring effect
    });
  };

  return (
    <div
      className={`-mr-4 relative group`}
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
          className="absolute inset-0 h-max w-[calc(100%_+_1rem)] flex text-xs flex-col items-center justify-center rounded-xl bg-500 border border-nav-border z-50 shadow-xl px-4 py-2 overflow-hidden"
        >
          <div className="absolute inset-x-5 z-30 w-[50%] -bottom-1 bg-gradient-to-r from-transparent via-900 dark:via-black to-transparent h-2 blur-xs rounded-[100%]" />
          <div className="absolute left-5 w-[50%] z-30 bottom-0 bg-gradient-to-r from-transparent via-900 dark:via-black to-transparent h-px" />
          <div className="font-medium text-secondary dark:text-primary-500 relative z-30 text-base flex items-center">
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
        className={`${className}`}
        onMouseMove={handleMouseMove}
      >
        {Children}
      </div>
    </div>
  );
};

export default AnimatedTooltip;
