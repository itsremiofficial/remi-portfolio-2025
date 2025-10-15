import { forwardRef, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { cn } from "../utils";
import { EXPERTIES } from "../constants/EXPERTIES";
import Squircle from "../components/ui/Squircle";
import { useResponsiveVars } from "../hooks/useResponsiveVars";
import { useRadius } from "../hooks/useRadius";

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const servicesContainer = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const spacerRef = useRef<HTMLDivElement | null>(null); // NEW spacer to avoid jump
  const [init, setInit] = useState(false);

  const { width, height, ratio } = useResponsiveVars(450, 628, "card");
  const { radius } = useRadius(450, 628);

  useGSAP(
    () => {
      const parentPin = sectionRef.current;
      const cards = cardsRef.current;
      if (!parentPin || !cards.length) return;

      // --- Stable scroll distance (do not derive from dynamic content during pin) ---
      let SCROLL_DISTANCE = window.innerHeight * 2;

      // Create spacer only once (after section) to emulate pin spacing manually
      if (!spacerRef.current) {
        const spacer = document.createElement("div");
        spacer.style.width = "100%";
        spacer.style.height = `${SCROLL_DISTANCE}px`;
        spacer.style.pointerEvents = "none";
        parentPin.insertAdjacentElement("afterend", spacer);
        spacerRef.current = spacer;
      }

      const updateSpacer = () => {
        SCROLL_DISTANCE = window.innerHeight * 2;
        if (spacerRef.current)
          spacerRef.current.style.height = `${SCROLL_DISTANCE}px`;
      };

      // ResizeObserver for width/height changes
      const ro = new ResizeObserver(() => {
        updateSpacer();
        ScrollTrigger.refresh();
      });
      ro.observe(document.documentElement);

      const SPREAD_PORTION = 0.33;
      const FLIP_BASE_START = 0.6;
      const FLIP_STAGGER = 0.05;
      const FLIP_PORTION = 0.33;
      const rotations = [-16, -6, 4];

      // Prepare card bases
      cards.forEach((card) => {
        gsap.set(card, { transformOrigin: "left center" });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: parentPin,
          start: "top top",
          end: () => "+=" + SCROLL_DISTANCE,
          pin: true,
          pinSpacing: false, // we provide our own spacer => no jump
          scrub: true,
          invalidateOnRefresh: true,
          pinType: parentPin.style.transform ? "transform" : "fixed",
          onEnter: () => setInit(true),
          onLeaveBack: () => setInit(false),
          // markers: true, // optional debug
          onRefreshInit: () => updateSpacer(),
        },
      });

      // Spread (parallel)
      const cardCount = cards.length;
      const positions = Array.from(
        { length: cardCount },
        (_, i) => ((i + 1) / (cardCount + 1)) * 100
      );
      cards.forEach((card, i) => {
        tl.to(card, { rotation: rotations[i], duration: SPREAD_PORTION }, 0).to(
          card,
          { left: `${positions[i]}%`, duration: SPREAD_PORTION },
          ">"
        );
      });

      // 3D Flip (staggered) with overshoot
      cards.forEach((card, i) => {
        const inner = card.querySelector(".flip-service-card-inner");
        const front = card.querySelector(".flip-service-card-front");
        const back = card.querySelector(".flip-service-card-back");
        if (!inner || !front || !back) return;

        gsap.set(inner, {
          transformStyle: "preserve-3d",
          transformPerspective: 1200,
          rotationY: 0,
        });
        gsap.set(front, { rotationY: 0, backfaceVisibility: "hidden" });
        gsap.set(back, {
          rotationY: 180,
          backfaceVisibility: "hidden",
          position: "absolute",
          inset: 0,
        });

        const flipStart = FLIP_BASE_START + i * FLIP_STAGGER;
        const overshootDeg = 215; // how much the card overshoots (more than 180 for better effect)
        const overshootPortion = 0.7;
        const settlePortion = 1 - overshootPortion;

        tl.to(
          inner,
          {
            rotationY: overshootDeg,
            duration: FLIP_PORTION * overshootPortion,
            ease: "power3.out",
          },
          flipStart
        )
          .to(
            inner,
            {
              rotationY: 180,
              duration: FLIP_PORTION * settlePortion,
              ease: "power2.out",
            },
            flipStart + FLIP_PORTION * overshootPortion
          )
          .to(
            card,
            {
              rotation: 0,
              duration: FLIP_PORTION,
              ease: "power2.out",
            },
            flipStart
          );
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        if (ro) ro.disconnect();
      };
    },
    { scope: sectionRef }
  );

  useEffect(
    () => () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      // Clean spacer (optional)
      if (spacerRef.current) {
        spacerRef.current.remove();
        spacerRef.current = null;
      }
    },
    []
  );

  return (
    <section
      className="services_section w-full relative mt-40 space-y-32"
      ref={sectionRef}
      id="services"
    >
      <div className="inline-flex items-end gap-[2vw] px-4 md:px-6 relative z-[2] [&>*]:select-none">
        <h2 id="selected-works-heading" className="sr-only">
          What Can I Do For You?
        </h2>
        <h2
          className="section-heading text-accent"
          style={{ transformStyle: "preserve-3d" }}
        >
          What
        </h2>
        <h2
          className="section-sub-heading dark:text-background text-foreground"
          style={{ transformStyle: "preserve-3d" }}
        >
          can I DO?
        </h2>
      </div>
      <div ref={servicesContainer} className="relative w-full min-h-[600px]">
        <div className="services_cards w-full h-full">
          {EXPERTIES.map(
            ({ title, subtitle, skills, Icon, illustration }, index) => (
              <ServiceCard
                key={title}
                init={init}
                id={`service-card-${title}`}
                index={index}
                width={width}
                height={height}
                ratio={ratio}
                frontSide={
                  <Squircle
                    width={width}
                    height={height}
                    radius={radius}
                    fill="transparent"
                    className="relative"
                  >
                    <div className="size-full bg-foreground dark:bg-background shadow-xl">
                      {illustration
                        ? (() => {
                            const Illustration = illustration;
                            return (
                              <Illustration className="size-full object-fit-cover text-white dark:text-foreground" />
                            );
                          })()
                        : null}
                    </div>
                  </Squircle>
                }
                backSide={
                  <Squircle
                    width={width}
                    height={height}
                    radius={radius}
                    fill="transparent"
                    className="relative"
                  >
                    <div className="h-full w-full relative bg-white dark:bg-background">
                      <div className="px-[clamp(1.5rem,1.5vw,30px)] py-[clamp(3rem,1.5vw,30px)] flex flex-col justify-between size-full space-y-4">
                        <h4 className="inline-flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-[clamp(4rem,1.5vw,40px)] leading-[10%] font-playground text-foreground relative z-10 mix-blend-darken">
                              {subtitle}
                            </span>
                            <span className="text-[clamp(2rem,1.5vw,30px)] leading-none font-grandbold text-accent">
                              {title}
                            </span>
                          </div>
                          {Icon && (
                            <Icon
                              // duotone={false}
                              className="size-[clamp(2.5rem,2vw,48px)] text-accent"
                            />
                          )}
                        </h4>
                        <ul className="skills-list flex flex-col h-full py-[0.5vw]">
                          {skills.map((skill, skillIndex) => (
                            <li
                              key={skillIndex}
                              className="text-[clamp(0.7rem,1.3vw,20px)] py-[clamp(0.1rem,1.5vw,10px)] grow border-y border-dashed border-foreground/20 text-foreground font-mono flex items-center"
                            >
                              {skill.li}
                            </li>
                          ))}
                        </ul>
                        <h4 className="text-[clamp(0.7rem,1.3vw,20px)] font-robo uppercase text-balance text-foreground/70 rotate-y-180 self-end flex justify-between items-baseline w-full">
                          {title}
                          {Icon && (
                            <Icon className="size-6 text-foreground/70" />
                          )}
                        </h4>
                      </div>
                    </div>
                  </Squircle>
                }
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;

interface ServiceCardProps {
  id?: string | number;
  index?: number;
  frontSide?: React.ReactNode;
  backSide?: React.ReactNode;
  init?: boolean;
  className?: string;
  width?: number;
  height?: number;
  ratio?: number;
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    { id, frontSide, backSide, index, init, className, width, height, ratio },
    ref
  ) => {
    const delayMs = index ? index * 200 : 0;

    return (
      <div
        ref={ref}
        className={cn("service-card will-change-transform z-[-1]")}
        style={{
          transition: "all 0.3s ease",
        }}
        id={id?.toString()}
      >
        <div
          className={cn(
            "service-card-wrapper w-full h-full relative",
            init && "animate-floating"
          )}
          style={{
            animationDelay: `${delayMs}ms`,
            width,
            height,
            aspectRatio: ratio,
          }}
        >
          <div
            className={cn(
              "flip-service-card-inner relative w-full h-full",
              className
            )}
          >
            <div className="flip-service-card-front absolute left-0 top-0 rounded-4xl overflow-hidden">
              {frontSide}
            </div>
            <div className="flip-service-card-back absolute left-0 top-0">
              {backSide}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";
