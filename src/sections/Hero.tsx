import { useGSAP } from "@gsap/react";
import ModernArrow from "../components/ModernArrow";
import AsteriskCircleAnimated from "../components/ui/AsteriskCircleAnimated";
import gsap from "gsap";

const Hero = () => {
  useGSAP(() => {
    const arrowTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.3,
    });

    arrowTl.fromTo(
      ".hero-modern-arrow",
      {
        x: -100,
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
      x: 100,
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
        x: 100,
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
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power2.in",
    });
    arrowTl.to(".hero-modern-arrow", {
      rotate: 0,
      duration: 1.2,
      ease: "power2.in",
    });
  });

  return (
    <section
      className="w-full min-h-[calc(100vh-6rem)] flex items-center justify-center"
      id="home"
    >
      <div className="flex flex-col justify-center text-center space-y-3 pb-24 font-var tracking-wide dark:text-background/40">
        <div className="text-[2.5vw] font-nippo flex items-center justify-center gap-[4vw] font-medium">
          Designer{" "}
          <ModernArrow className="hero-modern-arrow w-[3vw] h-max relative text-white" />{" "}
          Developer
        </div>
        <h1 className="mt-4 text-[10vw] text-wrap !font-medium">
          I <span className="dark:text-background">Turn</span> Imaginations
          <br />
          <div className="flex items-center justify-center gap-[4vw] w-full">
            Into
            <AsteriskCircleAnimated />
            <span className="dark:text-background">Interactive</span>
          </div>
          <span className="dark:text-background">Digital</span> Experiences
        </h1>
      </div>
    </section>
  );
};

export default Hero;
