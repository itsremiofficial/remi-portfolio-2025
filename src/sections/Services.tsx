import { forwardRef, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import MatterCanvas from "../components/ui/PillsCanvas";
import { cn } from "../utils";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const servicesContainer = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const spacerRef = useRef<HTMLDivElement | null>(null); // NEW spacer to avoid jump
  const [init, setInit] = useState(false);

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
      const rotations = [-12, -6, 0, 6];

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
      console.log(positions);
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
        const overshootDeg = 198;
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
              ease: "none",
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
      className="services_section min-h-screen h-full w-full relative mt-40"
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
      <div ref={servicesContainer} className="relative w-full h-[60%]">
        <div className="services_cards w-full h-full">
          {[1, 2, 3, 4].map((id, index) => (
            <ServiceCard
              key={id}
              init={init}
              id={`service-card-${id}`}
              index={index}
              frontSide={
                <div className="p-2">
                  <h4>Visual Design</h4>
                  <ul className="skills-list">
                    <li>Brand & Identity Design</li>
                    <li>Marketing & Advertising Design</li>
                    <li>Web & UI/UX Design</li>
                    <li>Product & Packaging Design</li>
                    <li>Motion & Multimedia Design</li>
                  </ul>
                </div>
              }
              backSide={<div className="p-6">Back Side {id}</div>}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 top-0 h-full w-full z-[0]">
        <MatterCanvas />
      </div>
      <div className="absolute inset-0 top-0 w-full h-56 z-[1] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-transparent dark:to-foreground to-background" />
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
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ id, frontSide, backSide, index, init }, ref) => {
    const delayMs = index ? index * 200 : 0;
    return (
      <div
        ref={ref}
        className="service-card will-change-transform z-[-1]"
        id={id?.toString()}
      >
        <div
          className={cn(
            "service-card-wrapper w-full h-full relative rounded-xl",
            init && "animate-floating"
          )}
          style={{ animationDelay: `${delayMs}ms` }}
        >
          <div className="flip-service-card-inner relative w-full h-full">
            <div className="flip-service-card-front absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-foreground/10 rounded-xl backdrop-blur-md shadow-lg">
              {frontSide}
            </div>
            <div className="flip-service-card-back absolute inset-0 flex items-center justify-center bg-accent/80 dark:bg-accent/30 rounded-xl backdrop-blur-md shadow-lg">
              {backSide}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";
