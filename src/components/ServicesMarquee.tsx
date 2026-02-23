import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import horizontalLoop from "../utils/horizontalLoop";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { cn } from "../utils";
import { SERVICES_MARQUEE } from "../constants/EXPERTIES";

const ServicesMarquee = () => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const ICON_CLASSES = "size-[6vw]";

  const REPEAT = 4;

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
    },
  );
  return (
    <div
      ref={servicesRef}
      className={cn(
        "flex items-center justify-center text-[8vw] font-extrabold bg-foreground text-background dark:bg-background dark:text-foreground py-12 align-self-start place-self-start font-grandbold",
        "[&>div]:select-none [&>div]:pointer-events-none [&>div]:mb-1 [&>div]:leading-none [&>div]:whitespace-nowrap [&>div]:flex [&>div]:items-center",
      )}
    >
      {Array.from({ length: REPEAT }).flatMap((_, i) =>
        SERVICES_MARQUEE.map(({ icon: Icon, title, subtitle }) => (
          <div className="marquee-services" key={`${i}-${title}`}>
            <div className="px-[8vw] lg:px-[8vw]">
              <Icon className={ICON_CLASSES} />
            </div>
            <div className="relative">
              {title}
              <span className="text-[8vw] absolute -bottom-4 inset-x-0 flex items-center justify-center font-playground leading-[80%] text-accent">
                {subtitle}
              </span>
            </div>
          </div>
        )),
      )}
    </div>
  );
};
export default ServicesMarquee;
