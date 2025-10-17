import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "../../utils";
import CircularText from "./CircularText";

// Constants
const ROTATION_DURATION = 25;
const STARBURST_VIEWBOX = "0 0 532 553";
const DEFAULT_SIZE = 150;
const DEFAULT_TEXT = "GET IN TOUCH   - - -   GET IN TOUCH   - - -   ";

// Star-burst SVG path
const STARBURST_PATH =
  "M223.788 17.144c23.493-22.727 60.777-22.727 84.27 0l10.738 10.389a60.6 60.6 0 0 0 50.622 16.447l14.794-2.092c32.365-4.578 62.528 17.337 68.175 49.532l2.582 14.717a60.6 60.6 0 0 0 31.286 43.061l13.198 7.003c28.875 15.32 40.396 50.779 26.041 80.145l-6.562 13.423a60.6 60.6 0 0 0 0 53.227l6.562 13.423c14.355 29.366 2.834 64.825-26.041 80.145l-13.198 7.003a60.6 60.6 0 0 0-31.286 43.062l-2.582 14.716c-5.647 32.195-35.81 54.11-68.175 49.532l-14.794-2.092a60.6 60.6 0 0 0-50.622 16.448l-10.738 10.389c-23.493 22.726-60.777 22.726-84.27 0l-10.738-10.389a60.6 60.6 0 0 0-50.622-16.448l-14.794 2.092c-32.365 4.578-62.528-17.337-68.175-49.532l-2.582-14.716a60.6 60.6 0 0 0-31.286-43.062l-13.199-7.003c-28.874-15.32-40.395-50.779-26.04-80.145l6.562-13.423a60.6 60.6 0 0 0 0-53.227l-6.562-13.423c-14.355-29.366-2.834-64.825 26.04-80.145l13.2-7.003a60.6 60.6 0 0 0 31.285-43.061l2.582-14.717c5.647-32.195 35.81-54.11 68.175-49.532l14.794 2.092a60.6 60.6 0 0 0 50.622-16.447z";

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
    <div className="relative flex items-center justify-center size-32 lg:size-40">
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
            "text-[10px] tracking-[0.72px] font-medium text-foreground",
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
