import { useGSAP } from "@gsap/react";
import ModernArrow from "../components/ModernArrow";
import gsap from "gsap";
import { useRef, useCallback, memo, useEffect, useState } from "react";
import IconArrowRight from "../components/icons/ArrowRight";
import Gallery from "../components/Gallery";
import horizontalLoop from "../utils/horizontalLoop";
import AsteriskCircleAnimated from "../components/ui/AsteriskCircleAnimated";
import CircularText from "../components/ui/CircularText";
import { cn } from "../utils";

// Extracted reusable pill component for better rendering
const Pill = memo(({ text }: { text: string }) => (
  <span
    className={cn(
      "text-xs md:text-sm leading-snug whitespace-nowrap",
      "px-3 md:px-5 py-0.5 md:py-1.5",
      "border rounded-full border-foreground/20 dark:border-background/20",
      "pointer-events-none select-none"
    )}
  >
    {text}
  </span>
));

// Animated ModernArrow component that handles its own animation
const AnimatedArrow = memo(() => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        xs: "(max-width: 639px)",
        sm: "(min-width: 640px) and (max-width: 767px)",
        md: "(min-width: 768px) and (max-width: 990px)",
        lg: "(min-width: 991px)",
      },
      (context) => {
        // Determine travel distance per breakpoint (tweak as desired)
        const { xs, sm, md, lg } = context.conditions as Record<
          string,
          boolean
        >;
        const xPercent = xs ? 30 : sm ? 40 : md ? 50 : lg ? 100 : 120;

        // Build timeline for current breakpoint
        const animParams = {
          duration: 1.2,
          opacity: { from: 0, to: 1 },
          xFrom: -xPercent,
          xTo: xPercent,
        };

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

        tl.fromTo(
          ".hero-modern-arrow",
          { x: animParams.xFrom, opacity: animParams.opacity.from },
          {
            x: 0,
            opacity: animParams.opacity.to,
            duration: animParams.duration,
            ease: "power2.out",
          }
        )
          .to(".hero-modern-arrow", {
            x: animParams.xTo,
            opacity: animParams.opacity.from,
            duration: animParams.duration,
            ease: "power2.in",
          })
          .to(".hero-modern-arrow", {
            rotate: 180,
            duration: animParams.duration,
            ease: "power2.in",
          })
          // return journey
          .fromTo(
            ".hero-modern-arrow",
            { x: animParams.xTo, opacity: animParams.opacity.from },
            {
              x: 0,
              opacity: animParams.opacity.to,
              duration: animParams.duration,
              ease: "power2.out",
            }
          )
          .to(".hero-modern-arrow", {
            x: animParams.xFrom,
            opacity: animParams.opacity.from,
            duration: animParams.duration,
            ease: "power2.in",
          })
          .to(".hero-modern-arrow", {
            rotate: 0,
            duration: animParams.duration,
            ease: "power2.in",
          });

        return () => tl.kill();
      }
    );

    return () => mm.kill();
  });

  return (
    <ModernArrow className="hero-modern-arrow w-[3vw] sm:w-[4vw] md:w-[3vw] lg:w-[2vw] h-max relative dark:text-background text-foreground" />
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
      className={`testimonial_hero ${name} w-[270px] md:w-[363.781px] w-inline-block bg-background/10 dark:bg-foreground/70 rounded-full border border-foreground/10 dark:border-background/10 backdrop-blur-md group/learnmore`}
      ref={forwardedRef}
    >
      <div className={`div-block-100 ${name}`}></div>
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="m-0 relative text-balance text-[0.6rem] md:text-[0.75rem]">
          <span className="quote_mark">"</span>
          {text}
        </p>
        <div className="relative text-decoration-none leading-none text-[0.6rem] md:text-[0.75rem]">
          <div className="font-medium group-hover/learnmore:text-accent transition-colors duration-300">
            Learn more
          </div>
          <div className="w-0 h-[1px] left-0 absolute bg-accent group-hover/learnmore:w-full transition-all duration-300"></div>
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

    const mm = gsap.matchMedia();

    mm.add(
      {
        mobile: "(max-width: 767px)",
        desktop: "(min-width: 768px)",
      },
      (context) => {
        const isMobile = !!context.conditions?.mobile;

        // Kill any previous timeline before rebuilding on breakpoint change
        tlRef.current?.kill();

        const commonParams = {
          duration: 0.7,
          ease: {
            in: "power3.in",
            out: "power3.out",
          },
          positions: {
            top: isMobile ? "-2.8em" : "-3.8em",
            bottom: isMobile ? "-1.3em" : "-1.7em",
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
          "trans1"
        )
          .to(
            dennis,
            {
              top: commonParams.positions.enter,
              scale: commonParams.scales.transition,
              duration: commonParams.duration,
              ease: commonParams.ease.in,
            },
            "trans1"
          )
          .add(() => {
            gsap.set(ari, { zIndex: 0 });
            gsap.set(dennis, { zIndex: 1 });
          })
          .to(
            ari,
            {
              top: commonParams.positions.bottom,
              scale: commonParams.scales.inactive,
              duration: commonParams.duration,
              ease: commonParams.ease.out,
            },
            "trans2"
          )
          .to(
            dennis,
            {
              top: commonParams.positions.top,
              scale: commonParams.scales.active,
              duration: commonParams.duration,
              ease: commonParams.ease.out,
            },
            "trans2"
          )
          .to({}, { duration: 4 })
          .to(
            ari,
            {
              top: commonParams.positions.enter,
              scale: commonParams.scales.transition,
              duration: commonParams.duration,
              ease: commonParams.ease.in,
            },
            "trans3"
          )
          .to(
            dennis,
            {
              top: commonParams.positions.exit,
              scale: commonParams.scales.transition,
              duration: commonParams.duration,
              ease: commonParams.ease.in,
            },
            "trans3"
          )
          .add(() => {
            gsap.set(ari, { zIndex: 1 });
            gsap.set(dennis, { zIndex: 0 });
          })
          .to(
            ari,
            {
              top: commonParams.positions.top,
              scale: commonParams.scales.active,
              duration: commonParams.duration,
              ease: commonParams.ease.out,
            },
            "trans4"
          )
          .to(
            dennis,
            {
              top: commonParams.positions.bottom,
              scale: commonParams.scales.inactive,
              duration: commonParams.duration,
              ease: commonParams.ease.out,
            },
            "trans4"
          );
      }
    );

    testimonialContainer.addEventListener("mouseenter", handleMouseEnter);
    testimonialContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      testimonialContainer.removeEventListener("mouseenter", handleMouseEnter);
      testimonialContainer.removeEventListener("mouseleave", handleMouseLeave);
      tlRef.current?.kill();
      mm.kill();
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <div
      className={cn(
        "marquee-item rounded-xl",
        "md:px-8 md:py-4",
        "min-w-[350px] md:min-w-[450px]",
        "text-foreground dark:text-background"
      )}
    >
      <div
        className="testimonials_highlights flex items-center justify-center w-80 md:w-90 h-28 md:h-28"
        ref={testimonialContainerRef}
      >
        <div className="absolute flex items-center justify-center w-full h-0">
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
    <div
      className={cn(
        "flex items-center justify-center marquee-item rounded-xl",
        "md:px-8 md:py-4",
        "min-w-[350px] md:min-w-[450px]",
        "text-foreground dark:text-background"
      )}
    >
      <div className="inline-flex gap-4 items-center">
        <div className="rounded-3xl md:rounded-4xl dark:bg-background/10 bg-foreground/10 overflow-hidden h-24 md:h-32 w-40 md:w-52 inline-flex justify-center">
          <div
            ref={videoMarqueeRef}
            className="flex !justify-center !items-center h-24 md:h-32"
          >
            <Gallery
              className="h-full flex !justify-center !items-center"
              autoPlay={userInteracted}
              muted={true}
              playsInline={true}
            />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm w-max md:text-xl font-medium text-foreground dark:text-background">
            Case Studies
          </h3>
          <p className="text-balance w-48 text-foreground/70 dark:text-background/70 text-xs">
            Explore these three distinct case studies to see how I can help you.
          </p>
          <a
            href="#case-studies"
            className={cn(
              "mt-3 flex items-center gap-2 text-xs md:text-sm font-medium cursor-pointer relative",
              "w-28 md:w-34 h-6 md:h-8 group/cta",
              "text-foreground dark:text-background transition-colors duration-300"
            )}
          >
            <span className="rounded-full w-full p-1 md:ml-0.5 absolute z-10 group-hover/cta:-ml-1.5 group-hover/cta:translate-x-3/4 transition-all duration-300 text-background">
              <IconArrowRight className="size-4 md:size-5" duotone={false} />
            </span>
            <div className="relative ml-8 md:ml-12 z-10 group-hover/cta:ml-4 transition-all duration-300  group-hover/cta:text-background">
              Learn more
            </div>
            <div className="absolute left-0 h-full w-6 md:w-8 aspect-square bg-accent z-0 rounded-full group-hover/cta:w-full transition-[width] duration-300"></div>
          </a>
        </div>
      </div>
    </div>
  );
});

// Skills Pills Marquee Item Component
const PillsMarqueeItem = memo(() => (
  <div
    className={cn(
      "flex items-center justify-center marquee-item rounded-xl",
      "md:px-8 md:py-4",
      "min-w-[350px] md:min-w-[450px]",
      "text-foreground dark:text-background"
    )}
  >
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Pill text="Design" />
        <Pill text="Development" />
        <Pill text="Animation" />
      </div>
      <div className="flex items-center gap-2">
        <Pill text="User Interface" />
        <Pill text="GSAP" />
        <span
          className={cn(
            "text-xs md:text-sm leading-snug whitespace-nowrap relative",
            "px-3 md:px-5 py-0.5 md:py-1.5",
            "border rounded-full border-foreground/20 dark:border-background/20",
            "select-none",
            "hover:border-accent hover:bg-accent hover:text-background",
            "pill5 group/arrow relative overflow-hidden min-w-max",
            "transition-all duration-300 cursor-pointer group/arrow"
          )}
        >
          <span className="relative z-10 inline-flex items-center gap-[0.4vw] group-hover/arrow:gap-[1vw] transition-all duration-300">
            More{" "}
            <IconArrowRight className="size-3.5 md:size-4" duotone={false} />
          </span>
        </span>
      </div>
    </div>
  </div>
));

const ContactIconItem = memo(() => {
  const contactIconRef = useRef<HTMLDivElement>(null);
  const iconId = useRef(
    `contact-icon-${Math.random().toString(36).substring(2, 9)}`
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
    <div
      className={cn(
        "flex items-center justify-center marquee-item rounded-xl",
        "md:px-8 md:py-4",
        "min-w-[350px] md:min-w-[300px]",
        "text-foreground dark:text-background"
      )}
    >
      <div className="size-32 lg:size-40 uppercase justify-self-center-safe relative group/contact rounded-full bg-foreground dark:bg-background text-background dark:text-foreground p-2 md:p-3 ">
        <CircularText
          id="marquee-scroll-text"
          text="GET IN TOUCH • GET IN TOUCH • GET IN TOUCH • "
          animate
          textClassName="text-[8.5px] tracking-[1.47px] font-bold"
          size={100}
          radius={87}
          animationDuration="25s"
        />
        <div
          ref={contactIconRef}
          className="absolute inset-0 flex items-center justify-center size-full"
        >
          <svg
            className="size-8 md:size-12"
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

// Update HeroTitle to accept controlled active + handlers
const HeroTitle = memo(
  ({
    active,
    onEnter,
    onLeave,
  }: {
    active: boolean;
    onEnter: () => void;
    onLeave: () => void;
  }) => (
    <h1
      className="font-robo font-var mt-4 text-[16vw] sm:text-[18vw] md:text-[13vw] lg:!text-[10vw] text-wrap font-medium leading-none tracking-wide group/hero text-center text-foreground/40 dark:text-background/40 uppercase"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      I Turn <br className="block lg:hidden" />
      <span className="text-foreground dark:text-background">
        Imaginations
      </span>{" "}
      <br />
      <span className="text-foreground dark:text-background">Into</span>
      <div className="inline-flex px-4 lg:px-10">
        <AsteriskCircleAnimated active={active} />
      </div>
      <br className="block lg:hidden" />
      Interactive
      <br />
      Digital <br className="block lg:hidden" />
      <span className="text-foreground dark:text-background">Experiences</span>
    </h1>
  )
);

// Main Hero component - now much simpler with self-contained subcomponents
const Hero = () => {
  const uiContainerRef = useRef<HTMLDivElement>(null);
  const [asteriskActive, setAsteriskActive] = useState(false); // NEW

  useGSAP(
    () => {
      document.fonts.ready.then(() => {
        horizontalLoop(".marquee-item", {
          repeat: -1,
          speed: 0.5,
        });
      });
    },
    { scope: uiContainerRef }
  );

  return (
    <section
      className="w-full min-h-[calc(100lvh-6rem)] md:min-h-[calc(100vh-6rem)] flex flex-col items-center justify-between"
      id="home"
    >
      <div className="flex items-center justify-center grow">
        <div className="flex flex-col justify-center space-y-3">
          <h4
            className="text-[3vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] font-nippo flex items-center justify-center gap-[4vw] font-medium uppercase
           text-center tracking-wide text-foreground/40 dark:text-background/40"
          >
            Designer <AnimatedArrow /> Developer
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
          <PillsMarqueeItem />
          <EnhancedGalleryMarqueeItem />
          <TestimonialsMarqueeItem />
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
