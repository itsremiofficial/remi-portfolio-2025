import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "gsap";
import { cn } from "../utils";
import horizontalLoop from "../utils/horizontalLoop";
import ContactIcon from "./hero/ContactIcon";
import { personalDetails } from "../constants/PERSONAL_DETAILS";

const REPEAT = 4;

const CONTACT_MARQUEE = [
  {
    title: "SEND AN EMAIL",
    subtitle: "I am eager to",
  },
  {
    title: "SEND AN EMAIL",
    subtitle: "hear from you",
  },
  {
    title: "SEND AN EMAIL",
    subtitle: "I am eager to",
  },
  {
    title: "SEND AN EMAIL",
    subtitle: "hear from you",
  },
];

const ContactMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
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
        timeline = horizontalLoop(".contact-marquee-item", {
          repeat: -1,
          speed: 1.5,
        });

        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);
      });

      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        timeline?.kill();
      };
    },
    { scope: containerRef },
  );

  return (
    <section id="contact" className="pb-48">
      <div
        ref={containerRef}
        className={cn(
          "flex items-center justify-center text-[8vw] font-extrabold bg-white dark:bg-foreground-dark border-y border-y-foreground/20 dark:border-y-background/20 text-foreground dark:text-background py-6 align-self-start place-self-start font-grandbold",
          "[&>div]:select-none [&>div]:mb-1 [&>div]:leading-none [&>div]:whitespace-nowrap [&>div]:flex [&>div]:items-center",
        )}
      >
        {Array.from({ length: REPEAT }).flatMap((_, i) =>
          CONTACT_MARQUEE.map(({ title, subtitle }, j) => (
            <div className="contact-marquee-item" key={`${i}-${j}-${title}`}>
              <ContactIcon
                textClassName="font-inter dark:text-background"
                bgClassName="text-accent dark:text-accent/80"
                className="contact_marquee"
              />
              <a
                href={`mailto:${personalDetails.email}`}
                className="relative text-group pointer-cursor"
              >
                {title}
                <span className="text-[10vw] absolute -bottom-6 inset-x-0 flex items-center justify-center font-playground leading-[80%] text-accent">
                  {subtitle}
                </span>
              </a>
            </div>
          )),
        )}
      </div>
    </section>
  );
};

export default ContactMarquee;
