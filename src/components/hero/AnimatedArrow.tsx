import { memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ModernArrow from "../ModernArrow";

const AnimatedArrow = memo(() => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        xs: "(max-width: 639px)",
        sm: "(min-width: 640px) and (max-width: 767px)",
        md: "(min-width: 768px) and (max-width: 990px)",
        lg: "(min-width: 991px)",
      },
      (context) => {
        const { xs, sm, md, lg } = context.conditions as Record<
          string,
          boolean
        >;
        const xPercent = xs ? 30 : sm ? 40 : md ? 50 : lg ? 100 : 120;

        const animParams = {
          duration: 1.2,
          opacity: { from: 0, to: 1 },
          xFrom: -xPercent,
          xTo: xPercent,
        };

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

        tl.fromTo(
          ".hero-modern-arrow",
          { x: animParams.xFrom, opacity: animParams.opacity.from },
          {
            x: 0,
            opacity: animParams.opacity.to,
            duration: animParams.duration,
            ease: "power2.out",
          }
        )
          .to(".hero-modern-arrow", {
            x: animParams.xTo,
            opacity: animParams.opacity.from,
            duration: animParams.duration,
            ease: "power2.in",
          })
          .to(".hero-modern-arrow", {
            rotate: 180,
            duration: animParams.duration,
            ease: "power2.in",
          })
          .fromTo(
            ".hero-modern-arrow",
            { x: animParams.xTo, opacity: animParams.opacity.from },
            {
              x: 0,
              opacity: animParams.opacity.to,
              duration: animParams.duration,
              ease: "power2.out",
            }
          )
          .to(".hero-modern-arrow", {
            x: animParams.xFrom,
            opacity: animParams.opacity.from,
            duration: animParams.duration,
            ease: "power2.in",
          })
          .to(".hero-modern-arrow", {
            rotate: 0,
            duration: animParams.duration,
            ease: "power2.in",
          });

        return () => tl.kill();
      }
    );

    return () => mm.kill();
  });

  return (
    <ModernArrow className="hero-modern-arrow w-[3vw] sm:w-[4vw] md:w-[3vw] lg:w-[2vw] h-max relative dark:text-background text-foreground" />
  );
});

export default AnimatedArrow;
