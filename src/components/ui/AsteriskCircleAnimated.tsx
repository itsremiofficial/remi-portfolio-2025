import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useCallback, memo } from "react";
import Asterisk from "./Asterisk";
import CircularText from "./CircularText";

const AsteriskCircleAnimated = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const asteriskRef = useRef<HTMLDivElement>(null);
  const circleTextRef = useRef<HTMLDivElement>(null);

  const handleMouseEnterAsterisk = useCallback(() => {
    if (!asteriskRef.current || !circleTextRef.current) return;

    gsap.to(asteriskRef.current, {
      scale: 0.55,
      duration: 0.3,
      ease: "power1.out",
    });
    gsap.to(circleTextRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power1.out",
    });
  }, []);

  const handleMouseLeaveAsterisk = useCallback(() => {
    if (!asteriskRef.current || !circleTextRef.current) return;

    gsap.to(asteriskRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power1.out",
    });
    gsap.to(circleTextRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power1.out",
    });
  }, []);

  // Create and manage GSAP animations with proper cleanup
  useGSAP(() => {
    if (!asteriskRef.current) return;

    const rotationAnimation = gsap.to(asteriskRef.current, {
      rotation: 360,
      duration: 10,
      ease: "linear",
      repeat: -1,
      transformOrigin: "center center",
    });

    // Return cleanup function
    return () => {
      rotationAnimation.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnterAsterisk}
      onMouseLeave={handleMouseLeaveAsterisk}
      className="relative size-[8vw] group/circle"
    >
      <div ref={asteriskRef} className="size-full">
        <Asterisk
          id="hero-asterisk"
          lineClass="bg-accent group-hover/circle:bg-background transition-colors duration-500"
        />
      </div>
      <div ref={circleTextRef} className="absolute inset-0 opacity-0">
        <CircularText
          id="hero-scroll-text"
          text="SCROLL DOWN FOR REMI STUFF ✦"
          animate
          size={100}
          fontSize={13.5}
          radius={87}
          fontWeight={500}
          letterSpacing="1.35px"
          fontFamily="Inter"
          animationDuration="25s"
        />
      </div>
    </div>
  );
};

export default memo(AsteriskCircleAnimated);
