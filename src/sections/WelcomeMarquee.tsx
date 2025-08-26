import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import horizontalLoop from "../utils/horizontalLoop";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer);

const WelcomeMarquee = () => {
  const welcomeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const speed = 3;
      document.fonts.ready.then(() => {
        const loop = horizontalLoop(".marquee-welcome", {
          repeat: -1,
          speed: 1.5,
        });
        let tl: GSAPTimeline | null = null;
        Observer.create({
          target: window,
          type: "wheel",
          onChangeY: (self) => {
            tl?.kill();
            const factor = self.deltaY > 0 ? 1.5 : -1.5;
            tl = gsap
              .timeline()
              .to(loop, { timeScale: speed * factor, duration: 0.25 })
              .to(loop, { timeScale: 1 * factor, duration: 1 });
          },
        });
      });
    },
    {
      scope: welcomeRef,
    }
  );
  return (
    <div
      ref={welcomeRef}
      className="flex items-center justify-center text-[7vw] font-extrabold bg-foreground text-background dark:bg-background dark:text-foreground py-4 align-self-start place-self-start "
    >
      <div className="leading-none marquee-welcome mt-2 mr-20">WELCOME</div>
      <div className="leading-none marquee-welcome mt-2 mr-20">WELCOME</div>
      <div className="leading-none marquee-welcome mt-2 mr-20">WELCOME</div>
      <div className="leading-none marquee-welcome mt-2 mr-20">WELCOME</div>
      <div className="leading-none marquee-welcome mt-2 mr-20">WELCOME</div>
      <div className="leading-none marquee-welcome mt-2 mr-20">WELCOME</div>
      <div className="leading-none marquee-welcome mt-2 mr-20">WELCOME</div>
    </div>
  );
};
export default WelcomeMarquee;
