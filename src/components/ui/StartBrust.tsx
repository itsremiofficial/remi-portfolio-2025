import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "../../utils";
import CircularText from "./CircularText";

// Constants
const ROTATION_DURATION = 25;
const STARBURST_VIEWBOX = "0 0 578 601";
const DEFAULT_SIZE = 150;
const DEFAULT_TEXT = "GET IN TOUCH • GET IN TOUCH • GET IN TOUCH • ";

// Star-burst SVG path
const STARBURST_PATH =
  "M244.061 24.771c21.093-32.595 68.784-32.595 89.878 0l6.073 9.385c13.766 21.273 40.561 29.979 64.202 20.86l10.43-4.022c36.224-13.972 74.807 14.06 72.713 52.829l-.603 11.163c-1.367 25.301 15.193 48.094 39.678 54.613l10.803 2.876c37.518 9.988 52.256 55.345 27.774 85.479l-7.049 8.676c-15.977 19.666-15.977 47.84 0 67.505l7.049 8.677c24.482 30.134 9.744 75.49-27.774 85.479l-10.803 2.876c-24.485 6.519-41.045 29.312-39.678 54.613l.603 11.163c2.094 38.768-36.489 66.8-72.713 52.829l-10.43-4.023c-23.641-9.118-50.436-.412-64.202 20.86l-6.073 9.385c-21.094 32.596-68.785 32.596-89.878 0l-6.074-9.385c-13.766-21.272-40.561-29.978-64.201-20.86l-10.43 4.023c-36.224 13.971-74.807-14.061-72.713-52.829l.603-11.163c1.367-25.301-15.194-48.094-39.679-54.613l-10.803-2.876c-37.518-9.989-52.255-55.345-27.773-85.479l7.049-8.677c15.977-19.665 15.977-47.839 0-67.505l-7.05-8.677c-24.48-30.133-9.744-75.49 27.774-85.478l10.803-2.876c24.485-6.519 41.046-29.312 39.679-54.613l-.603-11.163c-2.094-38.769 36.489-66.8 72.713-52.83l10.43 4.024c23.64 9.118 50.435.412 64.201-20.86z";

interface StartBrustProps {
  className?: string;
  textClassName?: string;
  size?: number;
  text?: string;
  animate?: boolean;
}

const StartBrust = ({
  className,
  textClassName,
  size = DEFAULT_SIZE,
  text = DEFAULT_TEXT,
  animate = true,
}: StartBrustProps) => {
  const starBrustRef = useRef<SVGSVGElement>(null);

  // Rotate star-burst background continuously
  useGSAP(() => {
    if (!starBrustRef.current || !animate) return;

    gsap.to(starBrustRef.current, {
      rotation: 360,
      repeat: -1,
      ease: "none",
      duration: ROTATION_DURATION,
      transformOrigin: "center center",
    });
  }, [animate]);

  return (
    <div className="relative flex items-center justify-center size-40">
      {/* Star-burst background */}
      <svg
        ref={starBrustRef}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        className={cn("size-full", className)}
        viewBox={STARBURST_VIEWBOX}
        aria-hidden="true"
      >
        <path fill="currentColor" d={STARBURST_PATH} />
      </svg>

      {/* Circular text overlay */}
      <div className="absolute inset-0 z-10 size-full p-3">
        <CircularText
          id="starburst-text"
          text={text}
          animate={animate}
          textClassName={cn(
            "text-[10px] tracking-[1.65px] font-medium text-foreground",
            textClassName
          )}
          size={size}
          animationDuration={`${ROTATION_DURATION}s`}
        />
      </div>
    </div>
  );
};

export default StartBrust;
