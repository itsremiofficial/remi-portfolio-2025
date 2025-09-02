import { useGSAP } from "@gsap/react";
import IconAltArrowLeft from "../components/icons/AltArrowLeft";
import IconAltArrowRight from "../components/icons/AltArrowRight";
import MagneticButton from "../components/MagneticButton";
import CursorFollower from "../components/ui/CursroFollower";
import WorksCards from "../components/WorksCards";
import gsap from "gsap";

const Works = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".wiggleleft",
      { x: -5 },
      {
        x: 5,
        duration: 1,
        ease: "0.7, 0, 0.2, 1",
        yoyo: true,
        repeat: -1,
      }
    );
    gsap.fromTo(
      ".wiggleright",
      { x: 5 },
      {
        x: -5,
        duration: 1,
        ease: "0.7, 0, 0.2, 1",
        yoyo: true,
        repeat: -1,
      }
    );
  });
  return (
    <div className="w-full space-y-8">
      <div className="px-6">
        <h2 className="text-[18vw] font-extrabold text-foreground dark:text-background uppercase leading-[13vw] pt-2 font-robo">
          Selected
        </h2>
        <div className="inline-flex gap-[2vw] items-end">
          <h2 className="text-[18vw] font-extrabold uppercase font-robo leading-[13vw] text-accent pt-2">
            Works
          </h2>
          <div className="space-y-[1vw] pb-3">
            <p className="hidden md:block w-max text-wrap text-[1.5vw] dark:text-background/70 text-foreground/70 font-robo leading-snug">
              Step inside my projects—where <br /> brands rise above the
              ordinary.
            </p>

            <MagneticButton
              className="bg-accent cursor-pointer py-[1.2vw] px-[4vw] group rounded-full"
              fillClassName="dark:bg-background bg-foreground"
              dataStrength={30}
              dataStrengthText={20}
            >
              <span className="inline-flex items-center gap-2 font-bold uppercase text-sm lg:text-lg font-robo leading-none text-balance text-background group-hover:text-background dark:group-hover:text-foreground transition-colors duration-500 whitespace-nowrap">
                Explore All
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>

      <CursorFollower
        cursorWrapperClassName="backdrop-blur-xl dark:bg-foreground/40 bg-background/40 rounded-full"
        cursor={
          <div className="relative size-30 lg:size-48 rounded-full border border-accent flex items-center justify-center gap-2 text-accent">
            <IconAltArrowLeft
              width={2}
              className="size-4 lg:size-6 wiggleleft"
            />
            <div className="size-2 lg:size-4 dark:bg-background bg-foreground rounded-full" />
            <IconAltArrowRight
              width={2}
              className="size-4 lg:size-6 wiggleright"
            />
          </div>
        }
      >
        <WorksCards />
      </CursorFollower>
    </div>
  );
};

export default Works;
