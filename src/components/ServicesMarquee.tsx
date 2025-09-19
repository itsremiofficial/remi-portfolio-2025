import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import horizontalLoop from "../utils/horizontalLoop";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

const ServicesMarquee = () => {
  const servicesRef = useRef<HTMLDivElement>(null);

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
      className="flex items-center justify-center text-[8vw] font-extrabold bg-foreground text-background dark:bg-background dark:text-foreground py-4 align-self-start place-self-start font-grandbold [&>*]:select-none [&>*]:pointer-events-none [&>*]:mb-1 [&>*]:pr-25 [&>*]:leading-none"
    >
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
      <div className="marquee-services">WELCOME</div>
    </div>
  );
};
export default ServicesMarquee;
