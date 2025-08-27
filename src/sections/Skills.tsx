import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // First, set up the title pin
    if (titleRef.current) {
      ScrollTrigger.create({
        trigger: ".wrapper",
        start: "top top",
        end: "bottom 950", // Match the cards' end trigger
        pin: titleRef.current,
        pinSpacing: false,
        id: "title-pin",
      });
    }

    // Add proper type assertions for GSAP utils
    const cardsWrappers = gsap.utils.toArray(".card-wrapper") as HTMLElement[];
    const cards = gsap.utils.toArray(".card") as HTMLElement[];

    cardsWrappers.forEach((wrapper, i) => {
      const card = cards[i];
      let scale = 1,
        rotation = 0;
      // if (i !== cards.length - 1) {
      scale = 0.8 + 0.025 * i;
      rotation = -10;
      // }
      gsap.to(card, {
        scale: scale,
        rotationX: rotation,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top " + (300 + 30 * i),
          end: "bottom 85%",
          endTrigger: ".wrapper",
          scrub: true,
          pin: wrapper,
          pinSpacing: false,
          id: `card-${i + 1}`,
        },
      });
    });
  });

  return (
    <section
      className="w-screen min-h-screen flex justify-center relative pt-48"
      id="skills"
    >
      <div className="wrapper w-full px-60 pb-60">
        <div
          ref={titleRef}
          className="text-[10vw] -z-10 left-0 top-16 text-center font-robo font-extrabold dark:text-background text-foreground"
        >
          SKILLS
        </div>
        <div className="cards w-full [&>.card]:max-w-7xl">
          <div className="card-wrapper w-full">
            <div className="card one"></div>
          </div>
          <div className="card-wrapper w-full">
            <div className="card two"></div>
          </div>
          <div className="card-wrapper w-full">
            <div className="card three"></div>
          </div>
          <div className="card-wrapper w-full">
            <div className="card four"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
