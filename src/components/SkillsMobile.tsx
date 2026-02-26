import React, { useRef } from "react";
import SimpleMarquee from "./ui/MarqueeMobile";

const skillsPills = [
  { name: "bootstrap" },
  { name: "framermotion" },
  { name: "expressjs" },
  { name: "figma" },
  { name: "illustrator" },
  { name: "github" },
  { name: "gsap" },
  { name: "javascript" },
  { name: "materialui" },
  { name: "sass" },
  { name: "mongodb" },
  { name: "mysql" },
  { name: "nextjs" },
  { name: "css3" },
  { name: "nodejs" },
  { name: "aftereffects" },
  { name: "reactjs" },
  { name: "socketio" },
  { name: "photoshop" },
  { name: "tailwindcss" },
  { name: "typescript" },
  { name: "premierpro" },
  { name: "googleanalytics" },
  { name: "seo" },
  { name: "html5" },
];
const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-1 cursor-pointer duration-300 ease-in-out">{children}</div>
);

export default function SkillsMobile() {
  const firstThird = skillsPills.slice(0, Math.floor(skillsPills.length / 3));
  const secondThird = skillsPills.slice(
    Math.floor(skillsPills.length / 3),
    Math.floor((2 * skillsPills.length) / 3),
  );
  const lastThird = skillsPills.slice(Math.floor((2 * skillsPills.length) / 3));

  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex relative justify-center items-center flex-col overflow-auto h-48 w-full"
      ref={container}
    >
      <div className="absolute h-[100%] top-0 w-full justify-center items-center flex flex-col space-y-1">
        <SimpleMarquee
          className="w-full"
          baseVelocity={8}
          repeat={4}
          draggable={false}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowDownFactor={0.1}
          slowdownOnHover
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          scrollAwareDirection={true}
          scrollContainer={container}
          useScrollVelocity={true}
          direction="left"
        >
          {firstThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={`/skills/${src.name}.svg`}
                alt={`Image ${i + 1}`}
                className="h-10"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="w-full"
          baseVelocity={8}
          repeat={4}
          scrollAwareDirection={true}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowdownOnHover
          slowDownFactor={0.1}
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          useScrollVelocity={true}
          scrollContainer={container}
          draggable={false}
          direction="right"
        >
          {secondThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={`/skills/${src.name}.svg`}
                alt={`Image ${i + firstThird.length}`}
                className="h-10"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="w-full"
          baseVelocity={8}
          repeat={4}
          draggable={false}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowDownFactor={0.1}
          slowdownOnHover
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          scrollAwareDirection={true}
          scrollContainer={container}
          useScrollVelocity={true}
          direction="left"
        >
          {lastThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={`/skills/${src.name}.svg`}
                alt={`Image ${i + firstThird.length + secondThird.length}`}
                className="h-10"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>
      </div>
    </div>
  );
}
