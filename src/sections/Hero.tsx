import { useGSAP } from "@gsap/react";
import ModernArrow from "../components/ModernArrow";
import AsteriskCircleAnimated from "../components/ui/AsteriskCircleAnimated";
import gsap from "gsap";
import { useRef, useCallback, memo, useEffect, useState } from "react";
import IconArrowRight from "../components/icons/ArrowRight";
import Gallery from "../components/Gallery";
import horizontalLoop from "../utils/horizontalLoop";
import CircularText from "../components/ui/CircularText";
import { DrawSVGPlugin, MorphSVGPlugin } from "gsap/all";

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);

// Extracted reusable pill component for better rendering
const Pill = memo(({ text }: { text: string }) => (
  <span className="text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none whitespace-nowrap">
    {text}
  </span>
));

// Animated ModernArrow component that handles its own animation
const AnimatedArrow = memo(() => {
  useGSAP(() => {
    const xPercent = 120;
    const animParams = {
      duration: 1.2,
      opacity: { from: 0, to: 1 },
      xFrom: -xPercent,
      xTo: xPercent,
    };

    const arrowTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.3,
    });

    // Right movement animation
    arrowTl.fromTo(
      ".hero-modern-arrow",
      { x: animParams.xFrom, opacity: animParams.opacity.from },
      {
        x: 0,
        opacity: animParams.opacity.to,
        duration: animParams.duration,
        ease: "power2.out",
      }
    );
    arrowTl.to(".hero-modern-arrow", {
      x: animParams.xTo,
      opacity: animParams.opacity.from,
      duration: animParams.duration,
      ease: "power2.in",
    });
    arrowTl.to(".hero-modern-arrow", {
      rotate: 180,
      duration: animParams.duration,
      ease: "power2.in",
    });

    // Left movement animation
    arrowTl.fromTo(
      ".hero-modern-arrow",
      { x: animParams.xTo, opacity: animParams.opacity.from },
      {
        x: 0,
        opacity: animParams.opacity.to,
        duration: animParams.duration,
        ease: "power2.out",
      }
    );
    arrowTl.to(".hero-modern-arrow", {
      x: animParams.xFrom,
      opacity: animParams.opacity.from,
      duration: animParams.duration,
      ease: "power2.in",
    });
    arrowTl.to(".hero-modern-arrow", {
      rotate: 0,
      duration: animParams.duration,
      ease: "power2.in",
    });

    return () => {
      arrowTl.kill();
    };
  });

  return (
    <ModernArrow className="hero-modern-arrow w-[3vw] h-max relative dark:text-background text-foreground" />
  );
});

// Testimonial item component for better code organization
const TestimonialItem = memo(
  ({
    name,
    text,
    href,
    forwardedRef,
  }: {
    name: string;
    text: string;
    href: string;
    forwardedRef: React.Ref<HTMLAnchorElement>;
  }) => (
    <a
      href={href}
      className={`testimonial_hero ${name} w-inline-block bg-background dark:bg-foreground rounded-full border border-foreground/10 dark:border-background/10`}
      ref={forwardedRef}
    >
      <div className={`div-block-100 ${name}`}></div>
      <div className="div-block-101">
        <p className="small_paragraph--tw1 text-balance">
          <span className="quote_mark">"</span>
          {text}
        </p>
        <div className="link_cta_container">
          <div className="link_cta">Learn more</div>
          <div className="link_underline"></div>
        </div>
      </div>
    </a>
  )
);

// Self-contained Testimonials component with its own animation
const TestimonialsMarqueeItem = memo(() => {
  const testimonialContainerRef = useRef<HTMLDivElement>(null);
  const ariRef = useRef<HTMLAnchorElement>(null);
  const dennisRef = useRef<HTMLAnchorElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Memoize event handlers
  const handleMouseEnter = useCallback(() => tlRef.current?.pause(), []);
  const handleMouseLeave = useCallback(() => tlRef.current?.play(), []);

  useGSAP(() => {
    if (
      !ariRef.current ||
      !dennisRef.current ||
      !testimonialContainerRef.current
    )
      return;

    const ari = ariRef.current;
    const dennis = dennisRef.current;
    const testimonialContainer = testimonialContainerRef.current;

    // Common animation parameters
    const commonParams = {
      duration: 0.7,
      ease: {
        in: "power3.in",
        out: "power3.out",
      },
      positions: {
        top: "-3.8em",
        bottom: "-1.7em",
        exit: "-5.8em",
        enter: "0.1em",
      },
      scales: {
        active: 1,
        inactive: 0.9,
        transition: 0.95,
      },
    };

    // Set initial states
    gsap.set(ari, {
      position: "absolute",
      top: commonParams.positions.top,
      zIndex: 1,
      scale: commonParams.scales.active,
    });
    gsap.set(dennis, {
      position: "absolute",
      top: commonParams.positions.bottom,
      zIndex: 0,
      scale: commonParams.scales.inactive,
    });

    // Create timeline
    const tl = gsap.timeline({ repeat: -1, paused: false });
    tlRef.current = tl;

    // First phase - hold for 4 seconds
    tl.to({}, { duration: 4 });

    // First transition - Ari exits top, Dennis enters from bottom
    tl.to(
      ari,
      {
        top: commonParams.positions.exit,
        scale: commonParams.scales.transition,
        duration: commonParams.duration,
        ease: commonParams.ease.in,
      },
      "transizione1"
    );
    tl.to(
      dennis,
      {
        top: commonParams.positions.enter,
        scale: commonParams.scales.transition,
        duration: commonParams.duration,
        ease: commonParams.ease.in,
      },
      "transizione1"
    );

    // Switch z-indices
    tl.add(() => {
      gsap.set(ari, { zIndex: 0 });
      gsap.set(dennis, { zIndex: 1 });
    });

    // Continue transition
    tl.to(
      ari,
      {
        top: commonParams.positions.bottom,
        scale: commonParams.scales.inactive,
        duration: commonParams.duration,
        ease: commonParams.ease.out,
      },
      "transizione2"
    );
    tl.to(
      dennis,
      {
        top: commonParams.positions.top,
        scale: commonParams.scales.active,
        duration: commonParams.duration,
        ease: commonParams.ease.out,
      },
      "transizione2"
    );

    // Second phase - hold for 4 seconds
    tl.to({}, { duration: 4 });

    // Third transition - Dennis exits top, Ari enters from bottom
    tl.to(
      ari,
      {
        top: commonParams.positions.enter,
        scale: commonParams.scales.transition,
        duration: commonParams.duration,
        ease: commonParams.ease.in,
      },
      "transizione3"
    );
    tl.to(
      dennis,
      {
        top: commonParams.positions.exit,
        scale: commonParams.scales.transition,
        duration: commonParams.duration,
        ease: commonParams.ease.in,
      },
      "transizione3"
    );

    // Switch z-indices back
    tl.add(() => {
      gsap.set(ari, { zIndex: 1 });
      gsap.set(dennis, { zIndex: 0 });
    });

    // Complete cycle
    tl.to(
      ari,
      {
        top: commonParams.positions.top,
        scale: commonParams.scales.active,
        duration: commonParams.duration,
        ease: commonParams.ease.out,
      },
      "transizione4"
    );
    tl.to(
      dennis,
      {
        top: commonParams.positions.bottom,
        scale: commonParams.scales.inactive,
        duration: commonParams.duration,
        ease: commonParams.ease.out,
      },
      "transizione4"
    );

    // Event listeners for mouse interactions
    testimonialContainer.addEventListener("mouseenter", handleMouseEnter);
    testimonialContainer.addEventListener("mouseleave", handleMouseLeave);

    // Clean up
    return () => {
      testimonialContainer.removeEventListener("mouseenter", handleMouseEnter);
      testimonialContainer.removeEventListener("mouseleave", handleMouseLeave);
      tlRef.current?.kill();
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <div className="marquee-item !min-w-[450px] px-8 py-4 rounded-xl text-foreground dark:text-background relative flex items-center justify-center">
      <div className="testimonials_highlights" ref={testimonialContainerRef}>
        <div className="div-block-103">
          <TestimonialItem
            name="ari"
            text="Mika is head and shoulders above the crowd, he took my rough design ideas..."
            href="#ari_review"
            forwardedRef={ariRef}
          />
          <TestimonialItem
            name="dennis"
            text="He brings creative ideas to life with precision and care...."
            href="#dennis_review"
            forwardedRef={dennisRef}
          />
        </div>
      </div>
    </div>
  );
});

// Enhanced Gallery component with proper video handling
const EnhancedGalleryMarqueeItem = memo(() => {
  const videoMarqueeRef = useRef<HTMLDivElement>(null);
  const [userInteracted, setUserInteracted] = useState(true);

  // Detect user interaction to allow video autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);

      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  return (
    <div className="marquee-item px-8 py-4 w-[450px]  flex items-center justify-center">
      <div className="inline-flex gap-4 items-center">
        <div className="rounded-4xl dark:bg-background/10 bg-foreground/10 overflow-hidden h-32 w-80 flex justify-center">
          <div
            ref={videoMarqueeRef}
            className="flex !justify-center !items-center h-32"
          >
            <Gallery
              className="w-full h-full flex !justify-center !items-center"
              autoPlay={userInteracted}
              muted={true}
              playsInline={true}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-medium text-foreground dark:text-background">
            Case Studies
          </div>
          <p className="text-balance text-foreground/70 dark:text-background/70 text-xs">
            Explore these three distinct case studies to see how I can help you.
          </p>
          <a
            href="#case-studies"
            className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground dark:text-background transition-colors cursor-pointer w-34 h-8 relative group/cta"
          >
            <span className="rounded-full w-full p-1 ml-0.5 absolute z-10 group-hover/cta:-ml-1.5 group-hover/cta:translate-x-3/4 transition-all duration-300 text-background">
              <IconArrowRight className="w-5 h-5" duotone={false} />
            </span>
            <div className="relative ml-12 z-10 group-hover/cta:ml-4 transition-all duration-300  group-hover/cta:text-background">
              Learn more
            </div>
            <div className="absolute left-0 h-full w-8 aspect-square bg-accent z-0 rounded-full group-hover/cta:w-full transition-[width] duration-300"></div>
          </a>
        </div>
      </div>
    </div>
  );
});

// Skills Pills Marquee Item Component
const PillsMarqueeItem = memo(() => (
  <div className="marquee-item px-4 py-4 rounded-xl text-foreground dark:text-background !min-w-[450px] flex items-center">
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Pill text="Design" />
        <Pill text="Development" />
        <Pill text="Animation" />
      </div>
      <div className="flex items-center gap-2">
        <Pill text="User Interface" />
        <Pill text="GSAP" />
        <span className="pill5 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug transition-all duration-300 cursor-pointer select-none group/arrow relative overflow-hidden hover:border-accent hover:bg-accent min-w-max">
          <span className="relative z-10 inline-flex items-center gap-[0.4vw] group-hover/arrow:gap-[1vw] transition-all duration-300">
            More <IconArrowRight className="w-4 h-4" duotone={false} />
          </span>
        </span>
      </div>
    </div>
  </div>
));

const ContactIconItem = memo(() => {
  const contactIconRef = useRef<HTMLDivElement>(null);
  const iconId = useRef(
    `contact-icon-${Math.random().toString(36).substr(2, 9)}`
  );

  useGSAP(() => {
    const contactIcon = contactIconRef.current;
    if (contactIcon) {
      // Get scoped references to the SVG elements
      const openPaper = contactIcon.querySelector(
        `.${iconId.current}-open-paper`
      );
      const openBase = contactIcon.querySelector(
        `.${iconId.current}-open-base`
      );
      const openLine1 = contactIcon.querySelector(`.${iconId.current}-line1`);
      const openLine2 = contactIcon.querySelector(`.${iconId.current}-line2`);
      const closedPaper = contactIcon.querySelector(
        `.${iconId.current}-closed-paper`
      );
      const closedBase = contactIcon.querySelector(
        `.${iconId.current}-closed-base`
      );

      // Set initial states - keep open elements hidden
      gsap.set([openPaper, openBase], {
        visibility: "hidden",
        opacity: 0,
      });

      gsap.set([openLine1, openLine2], {
        drawSVG: "0%",
        opacity: 0,
      });

      function handleMouseEnterContactIcon() {
        // Kill any ongoing animations
        gsap.killTweensOf(
          [
            closedBase,
            closedPaper,
            openBase,
            openPaper,
            openLine1,
            openLine2,
          ].filter(Boolean)
        ); // Filter out any null values

        // Make sure elements exist before animating
        if (!closedBase || !openBase || !closedPaper || !openPaper) return;

        const iconOpenTl = gsap.timeline();

        // Type guard to ensure we only proceed with SVGPathElement
        if (
          closedBase instanceof SVGPathElement &&
          openBase instanceof SVGPathElement
        ) {
          iconOpenTl.to(
            closedBase,
            {
              morphSVG: {
                shape: openBase,
                shapeIndex: 0,
              },
              duration: 0.8,
              ease: "power2.inOut",
            },
            0
          );
        }

        if (
          closedPaper instanceof SVGPathElement &&
          openPaper instanceof SVGPathElement
        ) {
          iconOpenTl.to(
            closedPaper,
            {
              morphSVG: {
                shape: openPaper,
                shapeIndex: 0,
              },
              duration: 0.8,
              ease: "power2.inOut",
            },
            0
          );
        }

        // Remaining animation code with null checks...
        if (openLine1) {
          iconOpenTl.to(
            openLine1,
            {
              opacity: 1,
              duration: 0.1,
            },
            "+=0.1"
          );

          iconOpenTl.to(
            openLine1,
            {
              drawSVG: "0% 100%",
              duration: 0.5,
              ease: "power2.out",
            },
            "<"
          );
        }

        if (openLine2) {
          iconOpenTl.to(
            openLine2,
            {
              opacity: 1,
              duration: 0.1,
            },
            "-=0.3"
          );

          iconOpenTl.to(
            openLine2,
            {
              drawSVG: "100% 0%",
              duration: 0.5,
              ease: "power2.out",
            },
            "<"
          );
        }
      }

      function handleMouseLeaveContactIcon() {
        // Kill any ongoing animations
        gsap.killTweensOf(
          [
            closedBase,
            closedPaper,
            openBase,
            openPaper,
            openLine1,
            openLine2,
          ].filter(Boolean)
        );

        // Null checks
        if (!closedBase || !openBase || !closedPaper || !openPaper) return;

        const iconCloseTl = gsap.timeline();

        // First hide the lines
        if (openLine1 && openLine2) {
          iconCloseTl.to([openLine1, openLine2], {
            drawSVG: "0%",
            duration: 0.4,
            ease: "power2.inOut",
          });

          iconCloseTl.to(
            [openLine1, openLine2],
            {
              opacity: 0,
              duration: 0.1,
            },
            "-=0.1"
          );
        }

        // Then morph back to closed state with proper type guards
        if (closedPaper instanceof SVGPathElement) {
          iconCloseTl.to(
            closedPaper,
            {
              morphSVG: {
                shape: closedPaper,
                shapeIndex: 0,
              },
              duration: 0.8,
              ease: "power2.inOut",
            },
            "+=0.1"
          );
        }

        if (closedBase instanceof SVGPathElement) {
          iconCloseTl.to(
            closedBase,
            {
              morphSVG: {
                shape: closedBase,
                shapeIndex: 0,
              },
              duration: 0.8,
              ease: "power2.inOut",
            },
            "<"
          );
        }
      }

      contactIcon.addEventListener("mouseenter", handleMouseEnterContactIcon);
      contactIcon.addEventListener("mouseleave", handleMouseLeaveContactIcon);

      return () => {
        contactIcon.removeEventListener(
          "mouseenter",
          handleMouseEnterContactIcon
        );
        contactIcon.removeEventListener(
          "mouseleave",
          handleMouseLeaveContactIcon
        );
      };
    }
  });

  return (
    <div className="marquee-item px-8 py-4 rounded-xl text-foreground dark:text-background !min-w-[450px] flex items-center justify-center">
      <div className="size-40 uppercase justify-self-center-safe relative group/contact rounded-full bg-foreground dark:bg-background text-background dark:text-foreground p-2">
        <CircularText
          id="marquee-scroll-text"
          text="GET IN TOUCH • GET IN TOUCH • GET IN TOUCH • "
          animate
          size={100}
          fontSize={8.5}
          radius={87}
          fontWeight={400}
          letterSpacing="1.40px"
          fontFamily="Inter"
          animationDuration="25s"
        />
        <div
          ref={contactIconRef}
          className="absolute inset-0 flex items-center justify-center size-full"
        >
          <svg
            className="size-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
          >
            <path
              className={`${iconId.current}-open-paper`}
              fill="currentColor"
              d="M105.33,34v26.53l-8,4.8v-31.33c0-9.31-.08-13.51-1.95-15.38s-6.07-1.95-15.38-1.95h-32c-9.31,0-13.51.08-15.38,1.95s-1.95,6.07-1.95,15.38v31.33l-8-4.8v-26.53c0-10.8,0-16.74,4.29-21.04,4.3-4.29,10.24-4.29,21.04-4.29h32c10.79,0,16.74,0,21.04,4.29,4.29,4.3,4.29,10.24,4.29,21.04Z"
            />
            <path
              fill="currentColor"
              className={`${iconId.current}-open-base`}
              opacity={0.5}
              d="M117.22,53.4c0-.17,0-.27,0-.28-.18-2.66-.66-4.55-1.61-6.32-1.74-3.26-4.51-5.1-9.56-8.46l-.71-.47v9.66c1.75,1.26,2.73,2.13,3.21,3.05.38.7.57,1.55.67,2.93,0,.02,0,2.3,0,4.69l-3.89,2.33-8,4.8-16.87,10.12c-8.02,4.82-12.03,7.22-16.46,7.22s-8.44-2.4-16.46-7.22l-16.87-10.12-8-4.8-3.89-2.33v-4.69c.1-1.38.3-2.23.67-2.93.49-.92,1.47-1.8,3.22-3.05v-9.66l-.71.47c-5.05,3.36-7.83,5.2-9.56,8.46-.95,1.77-1.43,3.66-1.61,6.32,0,.01,0,.11,0,.28-.12,1.59-.11,3.53-.1,6.02.02,6.7.09,13.53.26,20.44.41,16.4.61,24.6,6.64,30.63,6.03,6.03,14.34,6.23,30.96,6.65,10.34.26,20.59.26,30.92,0,16.62-.42,24.93-.62,30.96-6.65,6.03-6.03,6.24-14.23,6.65-30.63.17-6.91.23-13.74.25-20.44.01-2.5.02-4.43-.1-6.02Z"
            />
            <line
              className={`${iconId.current}-line1 origin-left`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={"8px"}
              stroke="currentColor"
              x1="53.18"
              y1="34"
              x2="74.5"
              y2="34"
            />
            <line
              className={`${iconId.current}-line2 origin-left`}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={"8px"}
              x1="53.18"
              y1="55.33"
              x2="74.5"
              y2="55.33"
            />
            <path
              className={`${iconId.current}-closed-paper`}
              fill="currentColor"
              d="M64,70.7c-3.89,0-7.78-1.55-13.01-4.64l-15.69-9.28c-1.9-1.12-2.53-3.58-1.41-5.48,1.13-1.9,3.58-2.53,5.48-1.41l15.69,9.28c7.85,4.64,10.03,4.64,17.88,0l15.69-9.28c1.9-1.12,4.36-.49,5.48,1.41s.49,4.35-1.41,5.48l-15.69,9.28c-5.23,3.09-9.12,4.64-13.01,4.64Z"
            />
            <path
              className={`${iconId.current}-closed-base`}
              opacity={0.5}
              fill="currentColor"
              d="M10.75,79.87c.35,16.35.52,24.52,6.56,30.58,6.03,6.06,14.43,6.27,31.22,6.69,10.35.26,20.6.26,30.95,0,16.79-.42,25.19-.63,31.22-6.69,6.03-6.06,6.21-14.23,6.56-30.58.11-5.26.11-10.48,0-15.74-.35-16.35-.52-24.52-6.56-30.58-6.03-6.06-14.43-6.27-31.22-6.69-10.35-.26-20.6-.26-30.95,0-16.79.42-25.19.63-31.22,6.69-6.03,6.06-6.21,14.23-6.56,30.58-.11,5.26-.11,10.48,0,15.74Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
});

// Memoized Hero Title Component
const HeroTitle = memo(() => (
  <h1 className="mt-4 text-[10vw] text-wrap font-medium leading-none tracking-wide">
    I <span className="text-foreground dark:text-background">Turn</span>{" "}
    Imaginations
    <br />
    <div className="flex items-center justify-center gap-[4vw] w-full">
      Into
      <AsteriskCircleAnimated />
      <span className="text-foreground dark:text-background">Interactive</span>
    </div>
    <span className="text-foreground dark:text-background">Digital</span>{" "}
    Experiences
  </h1>
));

// Main Hero component - now much simpler with self-contained subcomponents
const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      document.fonts.ready.then(() => {
        horizontalLoop(".marquee-item", {
          repeat: -1,
          speed: 0.5,
        });
      });
    },
    {
      scope: containerRef,
    }
  );

  return (
    <section
      className="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-between"
      id="home"
    >
      <div className="flex items-center justify-center grow">
        <div className="flex flex-col justify-center text-center space-y-3 pb-24 font-var tracking-wide text-foreground/40 dark:text-background/40 uppercase font-robo">
          <div className="text-[2.5vw] font-nippo flex items-center justify-center gap-[4vw] font-medium">
            Designer <AnimatedArrow /> Developer
          </div>
          <HeroTitle />
        </div>
      </div>

      <div className="h-50 flex items-center w-full justify-center bg-background dark:bg-foreground border-t-2 border-foreground/10 dark:border-background/10">
        <div
          ref={containerRef}
          className="relative flex items-center min-h-full overflow-hidden"
        >
          <PillsMarqueeItem />
          <TestimonialsMarqueeItem />
          <EnhancedGalleryMarqueeItem />
          <ContactIconItem />
          <PillsMarqueeItem />
          <TestimonialsMarqueeItem />
          <EnhancedGalleryMarqueeItem />
          <ContactIconItem />
          <PillsMarqueeItem />
          <TestimonialsMarqueeItem />
          <EnhancedGalleryMarqueeItem />
          <ContactIconItem />
        </div>
      </div>
    </section>
  );
};

export default Hero;
