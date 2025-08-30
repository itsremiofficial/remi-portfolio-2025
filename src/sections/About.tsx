import ModernArrow from "../components/ModernArrow";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useTheme } from "../hooks/useTheme";

gsap.registerPlugin(ScrollTrigger, SplitText);

const About = () => {
  const { isDark } = useTheme();
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const split = new SplitText(titleEl, { type: "words" });
    const words = split.words as HTMLElement[];
    if (!words.length) return;

    const arrowEl = titleEl.querySelector(".about-arrow") as HTMLElement | null;
    const targets: HTMLElement[] = arrowEl ? [...words, arrowEl] : words;

    targets.forEach((el) => {
      const parent = el.parentElement as HTMLElement | null;
      if (parent) gsap.set(parent, { perspective: 1000 });
    });

    // include .about-arrow in highlight list
    const highlightSpans = Array.from(
      titleEl.querySelectorAll(".about-highlight")
    ) as HTMLElement[];

    const insertIndex = Math.max(0, highlightSpans.length - 1);
    if (arrowEl) highlightSpans.splice(insertIndex, 0, arrowEl);

    const accentColor = isDark
      ? "var(--color-background)"
      : "var(--color-foreground)";

    // Tunables for smoother unpin
    const SCROLL_DISTANCE = 400; // total scroll distance percentage
    const EXIT_OFFSET = 0.15; // gap after color phase before exit starts

    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: titleEl,
        start: "center center",
        end: `+=${SCROLL_DISTANCE}%`, // extended to allow exit animation space
        endTrigger: "#about",
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    entranceTl
      .fromTo(
        targets,
        {
          willChange: "opacity, transform",
          z: () => gsap.utils.random(500, 950),
          opacity: 0,
          xPercent: () => gsap.utils.random(-100, 100),
          yPercent: () => gsap.utils.random(-10, 10),
          rotationX: () => gsap.utils.random(-90, 90),
          rotationY: () => gsap.utils.random(-25, 25),
        },
        {
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
          ease: "expo.out",
          stagger: { each: 0.006, from: "random" },
          duration: 1,
          onComplete: () => {
            gsap.set(targets, { willChange: "auto" });
          },
        }
      )
      .to(
        highlightSpans,
        {
          color: accentColor,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
        ">0.15"
      )

      .to(
        titleEl,
        {
          // yPercent: -50,
          autoAlpha: 0,
          ease: "power2.inOut",
          duration: 2,
        },
        `-=${EXIT_OFFSET}`
      );

    return () => {
      entranceTl.scrollTrigger?.kill();
      entranceTl.kill();
      split.revert();
    };
  }, [isDark]);

  return (
    <section
      className="w-full flex items-center justify-center overflow-hidden"
      id="about"
    >
      <h2
        ref={titleRef}
        className="content__title font-extrabold font-robo uppercase text-[6vw] leading-none text-center max-w-[80%] px-4 select-none opacity text-foreground dark:text-background"
      >
        Visual <span className="about-highlight">Designer</span> & Web{" "}
        <span className="about-highlight">Developer</span> dedicated to the{" "}
        craft of <span className="about-highlight">creating</span>{" "}
        <span className="about-arrow inline-flex items-center justify-center">
          0 <ModernArrow className="w-[6vw] h-max" /> 1
        </span>{" "}
        experiences till the last{" "}
        <span className="about-highlight">detail</span>.
      </h2>
    </section>
  );
};

export default About;
