import { useGSAP } from "@gsap/react";
import ModernArrow from "../components/ModernArrow";
import AsteriskCircleAnimated from "../components/ui/AsteriskCircleAnimated";
import gsap from "gsap";
import { useRef } from "react";
import IconArrowRight from "../components/icons/ArrowRight";
import Gallery from "../components/Gallery";

const Hero = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const videoMarqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const arrowTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.3,
    });

    const xPercent = 120;

    arrowTl.fromTo(
      ".hero-modern-arrow",
      {
        x: -xPercent,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      }
    );

    arrowTl.to(".hero-modern-arrow", {
      x: xPercent,
      opacity: 0,
      duration: 1.2,
      ease: "power2.in",
    });
    arrowTl.to(".hero-modern-arrow", {
      rotate: 180,
      duration: 1.2,
      ease: "power2.in",
    });

    arrowTl.fromTo(
      ".hero-modern-arrow",
      {
        x: xPercent,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      }
    );

    arrowTl.to(".hero-modern-arrow", {
      x: -xPercent,
      opacity: 0,
      duration: 1.2,
      ease: "power2.in",
    });
    arrowTl.to(".hero-modern-arrow", {
      rotate: 0,
      duration: 1.2,
      ease: "power2.in",
    });

    // Fix for the marquee animation
    if (!marqueeRef.current) return;

    // // Create a seamless infinite animation
    // const marqueeItems = marqueeRef.current.querySelectorAll(".marquee-item");

    // // First, duplicate all items for a seamless loop
    // const originalItems = Array.from(marqueeItems);
    // originalItems.forEach((item) => {
    //   const clone = item.cloneNode(true);
    //   marqueeRef.current?.appendChild(clone);
    // });

    // // Calculate the total width of the original items
    // let totalWidth = 0;
    // originalItems.forEach((item) => {
    //   const el = item as HTMLElement;
    //   const style = window.getComputedStyle(el);
    //   const width = el.offsetWidth;
    //   const marginRight = parseInt(style.marginRight) || 0;
    //   totalWidth += width + marginRight;
    // });

    // // Create the animation
    // gsap.to(marqueeRef.current, {
    //   x: -totalWidth,
    //   duration: totalWidth / 100, // Adjust speed (higher divisor = faster)
    //   repeat: -1,
    //   ease: "none", // Use "none" instead of Linear.easeNone
    //   repeatRefresh: true, // Important for smooth looping
    // });
  });

  return (
    <section
      className="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-between"
      id="home"
    >
      <div className="flex items-center justify-center grow">
        <div className="flex flex-col justify-center text-center space-y-3 pb-24 font-var tracking-wide text-foreground/40 dark:text-background/40 uppercase font-robo">
          <div className="text-[2.5vw] font-nippo flex items-center justify-center gap-[4vw] font-medium">
            Designer{" "}
            <ModernArrow className="hero-modern-arrow w-[3vw] h-max relative dark:text-background text-foreground" />{" "}
            Developer
          </div>
          <h1 className="mt-4 text-[10vw] text-wrap font-medium leading-none tracking-wide">
            I <span className="text-foreground dark:text-background">Turn</span>{" "}
            Imaginations
            <br />
            <div className="flex items-center justify-center gap-[4vw] w-full">
              Into
              <AsteriskCircleAnimated />
              <span className="text-foreground dark:text-background">
                Interactive
              </span>
            </div>
            <span className="text-foreground dark:text-background">
              Digital
            </span>{" "}
            Experiences
          </h1>
        </div>
      </div>
      <div className="h-50 flex items-center w-full justify-center bg-background dark:bg-foreground border-t-2 border-foreground/10 dark:border-background/10">
        {/* First row - left to right */}
        <div className="relative flex items-center w-full h-full bg-zinc-800">
          <div
            ref={marqueeRef}
            className="flex items-center gap-8 absolute whitespace-nowrap w-full "
          >
            <div className="marquee-item px-8 py-4 rounded-xl text-foreground dark:text-background w-1/4">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  "Design",
                  "Development",
                  "Animation",
                  "User Interface",
                  "GSAP",
                ].map((item, index) => (
                  <>
                    <span
                      key={index}
                      className={`pill${
                        index + 1
                      } text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none`}
                    >
                      {item}
                    </span>
                  </>
                ))}
                <span className="pill5 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug transition-all duration-300 cursor-pointer select-none group/arrow relative overflow-hidden hover:border-accent">
                  <span className="relative z-10 inline-flex items-center gap-[0.4vw] group-hover/arrow:gap-[1vw] transition-all duration-300">
                    More <IconArrowRight className="w-4 h-4" duotone={false} />
                  </span>
                  <div className="absolute inset-0 w-0 opacity-0 group-hover/arrow:opacity-100 group-hover/arrow:w-full h-full z-[0] group-hover/arrow:bg-accent transition-all duration-300 rounded-full"></div>
                </span>
              </div>
            </div>
            <div className="marquee-item px-8 py-4">
              <div className="inline-flex gap-8 items-center">
                <div className="rounded-4xl bg-foreground overflow-hidden h-[6vw] w-[14vw]">
                  <div
                    ref={videoMarqueeRef}
                    className="flex gap-2 w-[10vw] h-[6vw]"
                  >
                    <Gallery className="w-full h-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-medium text-background">
                    Case Studies
                  </div>
                  <p className="text-balance text-background/70 text-xs">
                    Explore these three distinct case studies to see how I can
                    help you.
                  </p>
                  <a
                    href=""
                    className="mt-3 flex items-center gap-2 text-sm font-medium text-background transition-colors cursor-pointer w-34 h-8 relative group/cta"
                  >
                    <span className="rounded-full w-full p-1 absolute z-10 group-hover/cta:translate-x-3/4 transition-all duration-300">
                      <IconArrowRight className="w-5 h-5" />
                    </span>
                    <div className="relative ml-12 z-10 group-hover/cta:ml-4 transition-all duration-300">
                      Learn more
                    </div>
                    <div className="absolute left-0 h-full w-8 aspect-square bg-accent z-0 rounded-full group-hover/cta:w-full transition-[width] duration-300"></div>
                  </a>
                </div>
              </div>
            </div>
            <div className="marquee-item px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background w-1/4">
              JavaScript
            </div>
            <div className="marquee-item px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background w-1/4">
              React
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
