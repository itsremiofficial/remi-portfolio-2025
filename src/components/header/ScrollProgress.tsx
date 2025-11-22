import { useRef, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";

interface ScrollProgressProps {
  isExpanded: boolean;
  menuContainerRef: RefObject<HTMLDivElement>;
}

const ScrollProgress = ({
  isExpanded,
  menuContainerRef,
}: ScrollProgressProps) => {
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const scrollProgressMaskRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ticking = false;
    const progressBar = scrollProgressRef.current;
    const progressMask = scrollProgressMaskRef.current;
    const menuContainer = menuContainerRef.current;

    if (!progressBar || !progressMask || !menuContainer) return;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const menuWidth = menuContainer.offsetWidth;
          const padding = 8; // 4px left + 4px right = 8px total
          const availableWidth = menuWidth - padding;
          const targetWidth = (scrollPercent / 100) * availableWidth;

          gsap.to(progressBar, {
            width: targetWidth,
            duration: 0.3,
            ease: "power2.out",
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [isExpanded, menuContainerRef]);

  return (
    <div
      ref={scrollProgressMaskRef}
      className="absolute left-[4px] top-[4px] right-[4px] bottom-[4px] rounded-3xl squircle z-[0] pointer-events-none overflow-hidden will-change-[height] h-[54px]"
    >
      <div
        ref={scrollProgressRef}
        className="absolute left-0 top-0 h-full bg-foreground/10 dark:bg-background/5 rounded-3xl squircle will-change-[width]"
        style={{ width: 0 }}
      />
    </div>
  );
};

export default ScrollProgress;
