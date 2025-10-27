import {
  forwardRef,
  useRef,
  useState,
  type ReactNode,
  Children,
  isValidElement,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { cn } from "../utils";
import { EXPERTIES } from "../constants/EXPERTIES";
import { useResponsiveVars } from "../hooks/useResponsiveVars";

// ===== CONSTANTS =====
const ANIMATION_CONFIG = {
  HEADING: {
    START: "top 80%",
    END: "top 30%",
    SCRUB: 0.6,
    DURATION: 1,
    STAGGER: 0.4,
    BLUR_START: "10px",
    BLUR_END: "0px",
    ROTATION_X: -45,
    OFFSET_PERCENT: 6,
  },
  CARD: {
    SCROLL_MULTIPLIER: 2,
    SCRUB: 0.5,
    ANTICIPATE_PIN: 1,
    PERSPECTIVE: 1200,
    REFRESH_PRIORITY: -1,
  },
  TIMELINE: {
    SPREAD_PORTION: 0.33,
    FLIP_BASE_START: 0.6,
    FLIP_STAGGER: 0.05,
    FLIP_PORTION: 0.33,
    OVERSHOOT_DEGREES: 215,
    OVERSHOOT_PORTION: 0.7,
  },
} as const;

const CARD_ROTATIONS = [-16, -6, 4] as const;

const CARD_DIMENSIONS = {
  WIDTH: 450,
  HEIGHT: 628,
  TYPE: "card",
} as const;

const RESPONSIVE_BREAKPOINTS = {
  MOBILE: {
    MAX_WIDTH: 640,
    CARD_SCALE: 0.65,
    MIN_HEIGHT: 400,
    GAP_REM: 15,
  },
  TABLET: {
    MAX_WIDTH: 1024,
    CARD_SCALE: 0.8,
    MIN_HEIGHT: 500,
    GAP_REM: 20,
  },
  DESKTOP: {
    CARD_SCALE: 1,
    MIN_HEIGHT: 600,
    GAP_REM: 28,
  },
} as const;

// ===== TYPES =====
interface ServiceCardProps {
  id?: string | number;
  index?: number;
  init?: boolean;
  className?: string;
  width?: number;
  height?: number;
  ratio?: number;
  children?: ReactNode;
}

interface FrontSideProps {
  children?: ReactNode;
  className?: string;
}

interface BackSideProps {
  children?: ReactNode;
  className?: string;
}

// ===== SUB-COMPONENTS =====
export const FrontSide = ({ children, className }: FrontSideProps) => (
  <div
    className={cn(
      "flip-service-card-front squircle rounded-[8rem] absolute left-0 top-0 overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);

FrontSide.displayName = "FrontSide";

export const BackSide = ({ children, className }: BackSideProps) => (
  <div
    className={cn(
      "flip-service-card-back squircle rounded-[8rem] absolute left-0 top-0 overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);

BackSide.displayName = "BackSide";

// ===== MAIN COMPONENT =====
const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const whatHeadingRef = useRef<HTMLHeadingElement>(null);
  const canIDoHeadingRef = useRef<HTMLHeadingElement>(null);
  const [init, setInit] = useState(false);

  const { width: serviceCardWidth, height: serviceCardHeight } =
    useResponsiveVars(
      CARD_DIMENSIONS.WIDTH,
      CARD_DIMENSIONS.HEIGHT,
      CARD_DIMENSIONS.TYPE
    );

  // Heading animations
  useGSAP(
    () => {
      const section = sectionRef.current;
      const whatHeading = whatHeadingRef.current;
      const canIDoHeading = canIDoHeadingRef.current;

      if (!section || !whatHeading || !canIDoHeading) return;

      const mm = gsap.matchMedia();
      const targets = [whatHeading, canIDoHeading];

      // Reduced motion - static display
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          clearProps: "transform",
        });
      });

      // Full motion - animated
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        targets.forEach((el) => el.classList.add("will-change-transform"));

        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: ANIMATION_CONFIG.HEADING.START,
              end: ANIMATION_CONFIG.HEADING.END,
              scrub: ANIMATION_CONFIG.HEADING.SCRUB,
            },
            defaults: { ease: "power1.inOut" },
            onComplete: () => {
              targets.forEach((el) =>
                el.classList.remove("will-change-transform")
              );
            },
          })
          .fromTo(
            targets,
            {
              autoAlpha: 0,
              xPercent: ANIMATION_CONFIG.HEADING.OFFSET_PERCENT,
              yPercent: ANIMATION_CONFIG.HEADING.OFFSET_PERCENT,
              filter: `blur(${ANIMATION_CONFIG.HEADING.BLUR_START})`,
              rotationX: ANIMATION_CONFIG.HEADING.ROTATION_X,
              transformPerspective: 1000,
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              rotationX: 0,
              filter: `blur(${ANIMATION_CONFIG.HEADING.BLUR_END})`,
              duration: ANIMATION_CONFIG.HEADING.DURATION,
              stagger: ANIMATION_CONFIG.HEADING.STAGGER,
            }
          );

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // Cards animation
  useGSAP(
    () => {
      const parentPin = sectionRef.current;
      const cards = cardsRef.current;
      if (!parentPin || !cards.length) return;

      let SCROLL_DISTANCE =
        window.innerHeight * ANIMATION_CONFIG.CARD.SCROLL_MULTIPLIER;

      // Create spacer for pin spacing
      if (!spacerRef.current) {
        const spacer = document.createElement("div");
        spacer.style.cssText = `width: 100%; height: ${SCROLL_DISTANCE}px; pointer-events: none;`;
        parentPin.insertAdjacentElement("afterend", spacer);
        spacerRef.current = spacer;
      }

      const updateSpacer = () => {
        SCROLL_DISTANCE =
          window.innerHeight * ANIMATION_CONFIG.CARD.SCROLL_MULTIPLIER;
        if (spacerRef.current) {
          spacerRef.current.style.height = `${SCROLL_DISTANCE}px`;
        }
      };

      // Responsive gap (in pixels) between cards
      // Converts rem to pixels (1rem = 16px)
      const getCardGap = () => {
        const baseFontSize = 16; // 1rem = 16px
        const screenWidth = window.innerWidth;

        if (screenWidth <= RESPONSIVE_BREAKPOINTS.MOBILE.MAX_WIDTH) {
          return RESPONSIVE_BREAKPOINTS.MOBILE.GAP_REM * baseFontSize; // 12rem = 192px
        } else if (screenWidth <= RESPONSIVE_BREAKPOINTS.TABLET.MAX_WIDTH) {
          return RESPONSIVE_BREAKPOINTS.TABLET.GAP_REM * baseFontSize; // 20rem = 320px
        }
        return RESPONSIVE_BREAKPOINTS.DESKTOP.GAP_REM * baseFontSize; // 28rem = 448px
      };

      // Observe resize events
      const ro = new ResizeObserver(() => {
        updateSpacer();
        ScrollTrigger.refresh();
      });
      ro.observe(document.documentElement);

      // Initialize all cards at center (stacked)
      cards.forEach((card) => {
        gsap.set(card, {
          left: "50%",
          x: 0,
          transformOrigin: "bottom left",
        });
      });

      // Main timeline
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: parentPin,
          start: "top top",
          end: () => `+=${SCROLL_DISTANCE}`,
          pin: true,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: ANIMATION_CONFIG.CARD.ANTICIPATE_PIN,
          refreshPriority: ANIMATION_CONFIG.CARD.REFRESH_PRIORITY,
          onEnter: () => setInit(true),
          onLeaveBack: () => setInit(false),
          onRefreshInit: () => updateSpacer(),
        },
      });

      // Calculate centered spread positions
      const cardGap = getCardGap();
      const totalCards = cards.length;
      const totalSpreadWidth = (totalCards - 1) * cardGap;
      const startOffset = -(totalSpreadWidth / 2);

      // Animate cards spreading from center (two-stage like original)
      cards.forEach((card, i) => {
        const xPosition = startOffset + i * cardGap;

        tl.to(
          card,
          {
            rotation: CARD_ROTATIONS[i],
            duration: ANIMATION_CONFIG.TIMELINE.SPREAD_PORTION,
          },
          0
        ).to(
          card,
          {
            x: xPosition,
            duration: ANIMATION_CONFIG.TIMELINE.SPREAD_PORTION,
          },
          ">"
        );
      });

      // Animate cards flipping
      cards.forEach((card, i) => {
        const inner = card.querySelector(".flip-service-card-inner");
        const front = card.querySelector(".flip-service-card-front");
        const back = card.querySelector(".flip-service-card-back");
        if (!inner || !front || !back) return;

        // Setup 3D flip
        gsap.set(inner, {
          transformStyle: "preserve-3d",
          transformPerspective: ANIMATION_CONFIG.CARD.PERSPECTIVE,
          rotationY: 0,
        });
        gsap.set(front, { rotationY: 0, backfaceVisibility: "hidden" });
        gsap.set(back, {
          rotationY: 180,
          backfaceVisibility: "hidden",
          position: "absolute",
          inset: 0,
        });

        const flipStart =
          ANIMATION_CONFIG.TIMELINE.FLIP_BASE_START +
          i * ANIMATION_CONFIG.TIMELINE.FLIP_STAGGER;

        // Overshoot animation for natural flip effect
        tl.to(
          inner,
          {
            rotationY: ANIMATION_CONFIG.TIMELINE.OVERSHOOT_DEGREES,
            duration:
              ANIMATION_CONFIG.TIMELINE.FLIP_PORTION *
              ANIMATION_CONFIG.TIMELINE.OVERSHOOT_PORTION,
            ease: "power3.out",
          },
          flipStart
        )
          .to(
            inner,
            {
              rotationY: 180,
              duration:
                ANIMATION_CONFIG.TIMELINE.FLIP_PORTION *
                (1 - ANIMATION_CONFIG.TIMELINE.OVERSHOOT_PORTION),
              ease: "power2.out",
            },
            flipStart +
              ANIMATION_CONFIG.TIMELINE.FLIP_PORTION *
                ANIMATION_CONFIG.TIMELINE.OVERSHOOT_PORTION
          )
          .to(
            card,
            {
              rotation: 0,
              duration: ANIMATION_CONFIG.TIMELINE.FLIP_PORTION,
              ease: "power2.out",
            },
            flipStart
          );
      });

      // Cleanup
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        ro.disconnect();
        if (spacerRef.current) {
          spacerRef.current.remove();
          spacerRef.current = null;
        }
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      className="services_section w-full relative mt-40 space-y-32 isolate z-10"
      ref={sectionRef}
      id="services"
      aria-label="Services - What Can I Do For You?"
    >
      {/* Section Heading */}
      <div className="inline-flex items-end gap-2 sm:gap-4 md:gap-[2vw] px-4 md:px-6 relative z-[2] [&>*]:select-none">
        <h2
          ref={whatHeadingRef}
          className="section-heading text-accent text-[clamp(3rem,10vw,8rem)] sm:text-[clamp(4rem,8vw,8rem)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          What
        </h2>
        <h2
          ref={canIDoHeadingRef}
          className="section-sub-heading dark:text-background text-foreground text-[clamp(2rem,7vw,5rem)] sm:text-[clamp(2.5rem,6vw,5rem)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          can I DO?
        </h2>
      </div>

      {/* Service Cards Container */}
      <div className="relative w-full min-h-[600px]">
        {/* <div className="services_cards w-full h-full"> */}
        {EXPERTIES.map(
          (
            { title, subtitle, skills, Icon, illustration: Illustration },
            index
          ) => (
            <ServiceCard
              key={title}
              init={init}
              id={`service-card-${title}`}
              index={index}
              width={serviceCardWidth}
              height={serviceCardHeight}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            >
              <FrontSide>
                <div className="size-full bg-foreground dark:bg-background">
                  {Illustration && (
                    <Illustration className="size-full object-fit-cover text-white dark:text-foreground" />
                  )}
                </div>
              </FrontSide>

              <BackSide>
                <div className="p-6 sm:p-8 md:p-8 lg:p-10 flex flex-col justify-between space-y-2 sm:space-y-3 md:space-y-4 size-full relative bg-white dark:bg-background">
                  {/* Card Header */}
                  <h4 className="inline-flex justify-between items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-[clamp(2rem,4vw,5rem)] leading-[0.3] font-playground text-foreground relative z-10 mix-blend-darken">
                        {subtitle}
                      </span>
                      <span className="text-[clamp(1.3rem,1.5vw,1.875rem)] leading-none font-grandbold text-accent">
                        {title}
                      </span>
                    </div>
                    {Icon && (
                      <Icon className="size-8 sm:size-8 lg:size-12 text-accent flex-shrink-0" />
                    )}
                  </h4>

                  {/* Skills List */}
                  <ul className="skills-list flex flex-col h-full py-1 sm:py-2 md:py-[0.5vw]">
                    {skills.map((skill, skillIndex) => (
                      <li
                        key={skillIndex}
                        className="text-[clamp(0.8rem,1.3vw,1.25rem)] py-1 sm:py-1.5 md:py-2 grow border-b nth-of-type-[1]:border-t nth-last-of-type-[1]:border-t-0 border-dashed border-foreground/20 text-foreground font-mono flex items-center"
                      >
                        {skill.li}
                      </li>
                    ))}
                  </ul>

                  {/* Card Footer */}
                  <h4 className="text-[clamp(0.625rem,2vw,0.875rem)] sm:text-[clamp(0.75rem,1.5vw,1rem)] md:text-[clamp(0.875rem,1.3vw,1.25rem)] font-robo uppercase text-balance text-foreground/70 rotate-y-180 self-end flex justify-between items-baseline w-full gap-2">
                    <span className="truncate">{title}</span>
                    {Icon && (
                      <Icon className="size-4 sm:size-5 md:size-6 text-foreground/70 flex-shrink-0" />
                    )}
                  </h4>
                </div>
              </BackSide>
            </ServiceCard>
          )
        )}
        {/* </div> */}
      </div>
    </section>
  );
};

export default Services;

// ===== SERVICE CARD COMPONENT =====
const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ id, index = 0, init, className, width, height, ratio, children }, ref) => {
    // Extract FrontSide and BackSide from children
    let frontSide: ReactNode = null;
    let backSide: ReactNode = null;

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === FrontSide) {
          frontSide = child;
        } else if (child.type === BackSide) {
          backSide = child;
        }
      }
    });

    // Calculate responsive scale based on viewport
    const getResponsiveScale = () => {
      if (typeof window === "undefined") return 1;
      const screenWidth = window.innerWidth;

      if (screenWidth <= RESPONSIVE_BREAKPOINTS.MOBILE.MAX_WIDTH) {
        return RESPONSIVE_BREAKPOINTS.MOBILE.CARD_SCALE;
      } else if (screenWidth <= RESPONSIVE_BREAKPOINTS.TABLET.MAX_WIDTH) {
        return RESPONSIVE_BREAKPOINTS.TABLET.CARD_SCALE;
      }
      return RESPONSIVE_BREAKPOINTS.DESKTOP.CARD_SCALE;
    };

    const scale = getResponsiveScale();

    return (
      <div
        ref={ref}
        className="service-card size-full will-change-transform z-[-1] transition-all duration-300 ease-out"
        id={id?.toString()}
        style={{
          width: width ? width * scale : undefined,
          height: height ? height * scale : undefined,
        }}
      >
        <div
          className={cn(
            "service-card-wrapper w-full h-full relative",
            init && "animate-floating"
          )}
          style={{
            animationDelay: `${index * 200}ms`,
            aspectRatio: ratio,
            maxWidth: "100%",
          }}
        >
          <div
            className={cn(
              "flip-service-card-inner relative w-full h-full",
              className
            )}
          >
            {frontSide}
            {backSide}
          </div>
        </div>
      </div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";
