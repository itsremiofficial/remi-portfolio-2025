import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import horizontalLoop from "../utils/horizontalLoop";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { cn } from "../utils";
import IconStarish from "./icons/Starish";

const WelcomeMarquee = () => {
  const welcomeRef = useRef<HTMLDivElement>(null);

  const REPEAT = 4;
  const ICON_CLASSES = "size-[6vw]";

  const WELCOME_MARQUEE = [
    {
      icon: IconStarish,
      title: "WELCOME",
      subtitle: "welcome",
    },
    {
      icon: IconStarish,
      title: "أهلاً وسهلاً",
      subtitle: "welcome",
    },
    {
      icon: IconStarish,
      title: "欢迎",
      subtitle: "welcome",
    },
    {
      icon: IconStarish,
      title: "Bem-vindo",
      subtitle: "welcome",
    },
    {
      icon: IconStarish,
      title: "स्वागत है",
      subtitle: "welcome",
    },
    {
      icon: IconStarish,
      title: "خوش آمدید",
      subtitle: "welcome",
    },
    {
      icon: IconStarish,
      title: "ようこそ",
      subtitle: "welcome",
    },
  ];

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
    <>
      {/* <div
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
      </div> */}
      <div
        ref={welcomeRef}
        className={cn(
          "flex items-center justify-center text-[8vw] font-extrabold bg-foreground text-background dark:bg-background dark:text-foreground py-6 align-self-start place-self-start font-grandbold",
          "[&>div]:select-none [&>div]:pointer-events-none [&>div]:mb-1 [&>div]:leading-none [&>div]:whitespace-nowrap [&>div]:flex [&>div]:items-center"
        )}
      >
        {Array.from({ length: REPEAT }).flatMap((_, i) =>
          WELCOME_MARQUEE.map(({ icon: Icon, title, subtitle }, j) => (
            <div
              className="marquee-services [&>div]:pr-25"
              key={`${i}-${title}`}
            >
              <div>
                <Icon className={ICON_CLASSES} />
              </div>
              <div className="relative">
                {title}
                <span className="text-[8vw] absolute inset-0 flex items-center justify-center font-playground leading-[80%] text-accent/80">
                  {subtitle}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
export default WelcomeMarquee;
