import { forwardRef, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import MatterCanvas from "../components/ui/PillsCanvas";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const servicesContainer = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const parentPin = sectionRef.current;
      const cards = cardsRef.current;
      if (!parentPin || !cards.length) return;

      // Normalized config
      const SPREAD_PORTION = 0.33;
      const FLIP_BASE_START = 0.5;
      const FLIP_STAGGER = 0.05;
      const FLIP_PORTION = 0.33;
      const positions = [14, 38, 62, 86];
      const rotations = [-15, -7.5, 7.5, 15];

      // Master timeline with native pin spacing (prevents jump)
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: parentPin,
          start: "top top",
          end: () => "+=" + window.innerHeight * 2, // extra scroll distance (adds after initial view)
          pin: true,
          pinSpacing: true, // let ScrollTrigger handle spacing smoothly
          scrub: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      // Spread (parallel)
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            left: `${positions[i]}%`,
            rotation: rotations[i],
            duration: SPREAD_PORTION,
          },
          0
        );
      });

      // Flip (stagger)
      cards.forEach((card, i) => {
        const front = card.querySelector(".flip-service-card-front");
        const back = card.querySelector(".flip-service-card-back");
        if (!front || !back) return;
        const flipStart = FLIP_BASE_START + i * FLIP_STAGGER;

        tl.to(front, { rotateY: -180, duration: FLIP_PORTION }, flipStart)
          .to(back, { rotateY: 0, duration: FLIP_PORTION }, flipStart)
          .to(card, { rotation: 0, duration: FLIP_PORTION }, flipStart);
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  useEffect(
    () => () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
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

      {/* Background Effects */}
      <div className="absolute inset-0 top-0 h-full w-full z-[0]">
        <MatterCanvas />
      </div>
      <div className="absolute inset-0 top-0 w-full h-56 z-[1] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-transparent dark:to-foreground to-background" />
      </div>

      {/* Cards */}
      <div ref={servicesContainer} className="relative w-full h-[60%]">
        <div className="services_cards w-full h-full">
          {[1, 2, 3, 4].map((id, index) => (
            <ServiceCard
              key={id}
              id={`card-${id}`}
              index={index}
              frontSide={<div className="p-6">Front Side {id}</div>}
              backSide={<div className="p-6">Back Side {id}</div>}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            />
          ))}
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
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ id, frontSide, backSide, index }, ref) => {
    const delayMs = index ? index * 200 : 0;
    return (
      <div
        ref={ref}
        className="service-card will-change-transform z-[-1]"
        id={id?.toString()}
      >
        <div
          className="service-card-wrapper w-full h-full relative rounded-xl overflow-hidden"
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
