import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import horizontalLoop from "../utils/horizontalLoop";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { cn } from "../utils";
import { WELCOME_TEXT } from "../constants/WELCOME";
import WelcomeScript from "./illustrations/WelcomScript";
import IconStarish from "./icons/Starish";

const WelcomeMarquee = () => {
  const welcomeRef = useRef<HTMLDivElement>(null);

  const REPEAT = 4;
  const ICON_CLASSES =
    "size-[8vw] lg:size-[4.5vw] starish2-icon text-background dark:text-foreground";

  useGSAP(
    () => {
      const speed = 5;
      document.fonts.ready.then(() => {
        const loop = horizontalLoop(".marquee-welcome", {
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

      // Animate each starish2-icon with random duration and stagger
      const icons = document.querySelectorAll<SVGSVGElement>(".starish2-icon");
      icons.forEach((icon, idx) => {
        const duration = (idx + 2) * 5;
        gsap.to(icon, {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration,
          repeat: -1,
          ease: "linear",
        });
      });
    },
    {
      scope: welcomeRef,
    },
  );
  return (
    <>
      <div
        ref={welcomeRef}
        className={cn(
          "flex items-center font-extrabold bg-foreground dark:bg-background py-10",
        )}
      >
        {Array.from({ length: REPEAT }).flatMap((_, repeatIdx) =>
          WELCOME_TEXT.map(({ icon: Icon }, idx) => (
            <div
              className="marquee-welcome flex items-center py-6"
              key={`${repeatIdx}-${idx}`}
            >
              <div className="px-[8vw] lg:px-[6vw]">
                <IconStarish className={ICON_CLASSES} />
              </div>
              <div className="relative">
                <Icon className="h-[12vw] lg:h-[6vw] text-background dark:text-foreground" />
                <span className="text-[8vw] absolute inset-0 flex items-center justify-center font-playground leading-[80%] text-accent z-20 pointer-events-none">
                  <WelcomeScript className="h-[12vw] lg:h-[6vw] relative top-[1.5vw] lg:top-[0.6vw]" />
                </span>
              </div>
            </div>
          )),
        )}
      </div>
    </>
  );
};
export default WelcomeMarquee;
