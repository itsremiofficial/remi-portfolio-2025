import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import horizontalLoop from "../utils/horizontalLoop";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { cn } from "../utils";

const WelcomeMarquee = () => {
  const welcomeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const speed = 5;
      document.fonts.ready.then(() => {
        const loop = horizontalLoop(".marquee-welcome", {
          repeat: -1,
          speed: 0.2,
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
      scope: welcomeRef,
    }
  );
  return (
    <div
      ref={welcomeRef}
      className={cn(
        "flex items-center justify-center text-[8vw] py-4 align-self-start place-self-start font-grandbold",
        "bg-foreground text-background dark:bg-background dark:text-foreground",
        "[&>*]:select-none [&>*]:pointer-events-none [&>*]:mb-1 [&>*]:pr-25 [&>*]:leading-none"
      )}
    >
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
      <div className="marquee-welcome">WELCOME</div>
    </div>
  );
};
export default WelcomeMarquee;
