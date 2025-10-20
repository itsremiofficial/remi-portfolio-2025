import ModernArrow from "../components/ModernArrow";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";

const About = () => {
  const aboutTitleRef = useRef<HTMLHeadingElement | null>(null);
  const aboutContainer = useRef<HTMLElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  useGSAP(
    () => {
      if (!fontsLoaded) return;

      const aboutTitleEl = aboutTitleRef.current;
      const sectionEl = aboutContainer.current;
      if (!aboutTitleEl || !sectionEl) return;

      const split = new SplitText(aboutTitleEl, { type: "words" });
      const words = split.words as HTMLElement[];
      if (!words.length) return;

      const arrowEl = aboutTitleEl.querySelector(
        ".about-arrow"
      ) as HTMLElement | null;
      const targets: HTMLElement[] = arrowEl ? [...words, arrowEl] : words;

      targets.forEach((el) => {
        const parent = el.parentElement as HTMLElement | null;
        if (parent) gsap.set(parent, { perspective: 1000 });
      });

      const highlightSpans = Array.from(
        aboutTitleEl.querySelectorAll(".about-highlight")
      ) as HTMLElement[];
      const insertIndex = Math.max(0, highlightSpans.length - 1);
      if (arrowEl) highlightSpans.splice(insertIndex, 0, arrowEl);

      const highlightWords = words.filter((w) => w.closest(".about-highlight"));
      const arrowWords = arrowEl
        ? words.filter((w) => arrowEl.contains(w))
        : [];

      const SCROLL_DISTANCE = 400;

      let fullOpacityTargets = Array.from(
        new Set(
          [
            ...highlightWords,
            ...arrowWords,
            arrowEl as HTMLElement | undefined,
          ].filter(Boolean)
        )
      ) as HTMLElement[];

      // Reorder so arrow group goes before last highlight group
      if (arrowEl && highlightSpans.length) {
        const lastHighlightSpan = highlightSpans[highlightSpans.length - 1];
        const lastSpanWords = words.filter((w) =>
          lastHighlightSpan.contains(w)
        );
        const arrowGroup = [arrowEl, ...arrowWords].filter(
          (n, i, a) => a.indexOf(n) === i
        );
        const others = fullOpacityTargets.filter(
          (el) => !arrowGroup.includes(el) && !lastSpanWords.includes(el)
        );
        fullOpacityTargets = [...others, ...arrowGroup, ...lastSpanWords];
      }

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: `+=${SCROLL_DISTANCE}%`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 1,
          invalidateOnRefresh: true,
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
            opacity: (_, el) =>
              arrowWords.includes(el as HTMLElement) ? 1 : 0.25,
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
          fullOpacityTargets,
          {
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.15"
        );

      return () => {
        entranceTl.scrollTrigger?.kill();
        entranceTl.kill();
        split.revert();
      };
    },
    { scope: aboutContainer, dependencies: [fontsLoaded] }
  );

  return (
    <section
      ref={aboutContainer}
      className="about-section h-screen w-full flex items-center justify-center overflow-hidden relative isolate"
      id="about"
      style={{ zIndex: 20 }}
    >
      <h2
        ref={aboutTitleRef}
        className="content__title font-extrabold font-robo uppercase text-[10vw] lg:text-[8vw] xl:text-[6vw] leading-none text-center max-w-[80%] px-4 select-none text-foreground dark:text-background"
      >
        Visual <span className="about-highlight font-grandbold">Designer</span>{" "}
        <br className="lg:hidden" /> & Web{" "}
        <span className="about-highlight font-grandbold">Developer</span>{" "}
        dedicated to the{" "}
        <span className="about-highlight lg:hidden font-grandbold lg:font-robo">
          craft
        </span>
        <span className="hidden lg:inline-block font-grandbold lg:font-robo">
          craft
        </span>{" "}
        of <span className="lg:hidden">creating</span>
        <span className="about-highlight hidden lg:inline-block font-grandbold">
          creating
        </span>{" "}
        <span className="about-arrow inline-flex items-center justify-center gap-2 font-grandbold">
          0 <ModernArrow className="w-[10vw] lg:w-[6vw] h-max" /> 1
        </span>{" "}
        experiences till the <br className="lg:hidden" /> last{" "}
        <span className="about-highlight font-grandbold">detail</span>.
      </h2>
    </section>
  );
};

export default About;
