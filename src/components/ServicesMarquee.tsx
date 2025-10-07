import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import horizontalLoop from "../utils/horizontalLoop";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import IconDesign from "./icons/Design";
import IconDevelopment from "./icons/Development";
import IconMarketing from "./icons/Marketing";
import { cn } from "../utils";

const ServicesMarquee = () => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const ICON_SIZE = "size-[8vw]";
  const SERVICES = [
    { icon: IconDesign, label: "VISUAL DESIGN" },
    { icon: IconDevelopment, label: "WEB DEVELOPMENT" },
    { icon: IconMarketing, label: "DIGITAL MARKETING" },
  ];
  const REPEAT = 4; // Adjust to match the original number of items

  useGSAP(
    () => {
      const speed = 3;
      document.fonts.ready.then(() => {
        const loop = horizontalLoop(".marquee-services", {
          repeat: -1,
          speed: 1,
        });
        let tl: GSAPTimeline | null = null;
        Observer.create({
          target: window,
          type: "wheel",
          onChangeY: (self) => {
            tl?.kill();
            const factor = self.deltaY > 0 ? 2.5 : -2.5;
            tl = gsap
              .timeline()
              .to(loop, { timeScale: speed * factor, duration: 0.25 })
              .to(loop, { timeScale: 1 * factor, duration: 1 });
          },
        });
      });
    },
    {
      scope: servicesRef,
    }
  );
  return (
    <div
      ref={servicesRef}
      className={cn(
        "flex items-center justify-center text-[8vw] font-extrabold bg-foreground text-background dark:bg-background dark:text-foreground py-4 align-self-start place-self-start font-grandbold",
        "[&>div]:select-none [&>div]:pointer-events-none [&>div]:mb-1 [&>div]:pr-25 [&>div]:leading-none [&>div]:whitespace-nowrap [&>div]:flex [&>div]:items-center [&>div]:gap-4"
      )}
    >
      {Array.from({ length: REPEAT }).flatMap((_, i) =>
        SERVICES.map(({ icon: Icon, label }, j) => (
          <div className="marquee-services" key={`${i}-${label}`}>
            <div>
              <Icon fill className={ICON_SIZE} />
            </div>
            <div>{label}</div>
          </div>
        ))
      )}
    </div>
  );
};
export default ServicesMarquee;
