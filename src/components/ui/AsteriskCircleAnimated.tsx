import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useCallback, memo, useEffect } from "react";
import Asterisk from "./Asterisk";
import CircularText from "./CircularText";

interface AsteriskCircleAnimatedProps {
  active?: boolean; // NEW (controlled mode if defined)
}

const AsteriskCircleAnimated = ({ active }: AsteriskCircleAnimatedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const asteriskRef = useRef<HTMLDivElement>(null);
  const circleTextRef = useRef<HTMLDivElement>(null);
  const enterTlRef = useRef<gsap.core.Timeline | null>(null); // CHANGED (was Tween)
  const leaveTlRef = useRef<gsap.core.Timeline | null>(null); // CHANGED (was Tween)

  const playEnter = useCallback(() => {
    if (!asteriskRef.current || !circleTextRef.current) return;
    leaveTlRef.current?.kill();
    enterTlRef.current = gsap
      .timeline()
      .to(
        asteriskRef.current,
        {
          scale: 0.55,
          duration: 0.3,
          ease: "power1.out",
        },
        0
      )
      .to(
        circleTextRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: "power1.out",
        },
        0
      );
  }, []);

  const playLeave = useCallback(() => {
    if (!asteriskRef.current || !circleTextRef.current) return;
    enterTlRef.current?.kill();
    leaveTlRef.current = gsap
      .timeline()
      .to(
        asteriskRef.current,
        {
          scale: 1,
          duration: 0.3,
          ease: "power1.out",
        },
        0
      )
      .to(
        circleTextRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power1.out",
        },
        0
      );
  }, []);

  // Previous hover handlers (used only in uncontrolled mode)
  const handleMouseEnterAsterisk = useCallback(() => {
    if (active !== undefined) return; // ignore if controlled
    playEnter();
  }, [active, playEnter]);

  const handleMouseLeaveAsterisk = useCallback(() => {
    if (active !== undefined) return; // ignore if controlled
    playLeave();
  }, [active, playLeave]);

  // Controlled mode effect
  useEffect(() => {
    if (active === undefined) return;
    if (active) playEnter();
    else playLeave();
  }, [active, playEnter, playLeave]);

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
      enterTlRef.current?.kill();
      leaveTlRef.current?.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      // bind hover only if uncontrolled
      onMouseEnter={active === undefined ? handleMouseEnterAsterisk : undefined}
      onMouseLeave={active === undefined ? handleMouseLeaveAsterisk : undefined}
      className="relative size-[8vw] group/circle"
    >
      <div ref={asteriskRef} className="size-full">
        <Asterisk
          id="hero-asterisk"
          lineClass="bg-accent group-hover/hero:bg-foreground dark:group-hover/hero:bg-background transition-colors duration-500"
        />
      </div>
      <div
        ref={circleTextRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
      >
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
