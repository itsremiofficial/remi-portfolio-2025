import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import { useRef, useCallback, useState, useMemo } from "react";

// Components
import AnimatedArrow from "../components/hero/AnimatedArrow";
import HeroTitle from "../components/hero/HeroTitle";
import TestimonialsMarquee from "../components/hero/TestimonialsMarquee";
import GalleryMarquee from "../components/hero/GalleryMarquee";
import SkillsMarquee from "../components/hero/SkillsMarquee";
import ContactIcon from "../components/hero/ContactIcon";

// Utils & Hooks
import horizontalLoop from "../utils/horizontalLoop";
import { useScrollTo } from "../hooks/useLenis";

// Main Hero component
const Hero = () => {
  const uiContainerRef = useRef<HTMLDivElement>(null);
  const marqueeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [asteriskActive, setAsteriskActive] = useState(false);
  const { scrollToElement } = useScrollTo();

  // Create custom ease for smooth scrolling
  const ease = useMemo(() => CustomEase.create("custom", "0.7, 0, 0.2, 1"), []);

  // Handle navigation click to scroll to section and optionally dispatch event
  const handleNavigation = useCallback(
    (targetId: string) => {
      // First scroll to the target section
      scrollToElement(targetId, {
        offset: -100,
        duration: 2.5,
        easing: (t: number): number => ease(t),
      });

      // If it's a testimonial ID (not "skills"), dispatch event
      if (targetId !== "skills") {
        setTimeout(() => {
          const event = new CustomEvent("scrollToTestimonial", {
            detail: { id: targetId },
          });
          window.dispatchEvent(event);
        }, 2600);
      }
    },
    [scrollToElement, ease]
  );

  useGSAP(
    () => {
      const container = uiContainerRef.current;
      if (!container) return;

      let timeline: gsap.core.Timeline | null = null;

      const handleMouseEnter = () => {
        if (!timeline) return;
        gsap.to(timeline, {
          timeScale: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        if (!timeline) return;
        gsap.to(timeline, {
          timeScale: 1,
          duration: 0.5,
          ease: "power2.in",
        });
      };

      document.fonts.ready.then(() => {
        timeline = horizontalLoop(".marquee-item", {
          repeat: -1,
          speed: 0.3,
        });
        marqueeTimelineRef.current = timeline;

        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);
      });

      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        timeline?.kill();
      };
    },
    { scope: uiContainerRef }
  );

  return (
    <section
      className="hero w-full min-h-[calc(100lvh-6rem)] md:min-h-[calc(100vh-6rem)] flex flex-col items-center justify-between"
      id="home"
    >
      <div className="flex items-center justify-center grow">
        <div className="flex flex-col justify-center space-y-3">
          <h4
            className="text-[3vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] font-mono flex items-center justify-center gap-[4vw] font-medium
           text-center tracking-wide text-foreground/40 dark:text-background/40"
          >
            designer <AnimatedArrow /> developer
          </h4>

          <HeroTitle
            active={asteriskActive}
            onEnter={() => setAsteriskActive(true)}
            onLeave={() => setAsteriskActive(false)}
          />
        </div>
      </div>

      <div className="h-40 md:h-50 flex items-center w-full justify-center bg-background dark:bg-foreground border-t-2 border-foreground/5 dark:border-background/5">
        <div
          ref={uiContainerRef}
          className="relative flex items-center min-h-full overflow-hidden"
        >
          <SkillsMarquee onSkillClick={handleNavigation} />
          <TestimonialsMarquee onTestimonialClick={handleNavigation} />
          <GalleryMarquee />
          <ContactIcon />
          <SkillsMarquee onSkillClick={handleNavigation} />
          <TestimonialsMarquee onTestimonialClick={handleNavigation} />
          <GalleryMarquee />
          <ContactIcon />
          <SkillsMarquee onSkillClick={handleNavigation} />
          <TestimonialsMarquee onTestimonialClick={handleNavigation} />
          <GalleryMarquee />
          <ContactIcon />
        </div>
      </div>
    </section>
  );
};

export default Hero;
