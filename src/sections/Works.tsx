import { useGSAP } from "@gsap/react";
import IconAltArrowLeft from "../components/icons/AltArrowLeft";
import IconAltArrowRight from "../components/icons/AltArrowRight";
import MagneticButton from "../components/MagneticButton";
import ModernArrow from "../components/ModernArrow";
import CursorFollower from "../components/ui/CursroFollower";
import WorksCards from "../components/WorksCards";
import gsap from "gsap";
import IconArrowRight from "../components/icons/ArrowRight";

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
    <div className="min-h-screen space-y-8">
      <div className="px-6">
        <h2 className="text-[20vw] font-extrabold text-foreground dark:text-background uppercase leading-[15vw] pt-2 font-robo">
          Selected
        </h2>
        <div className="inline-flex gap-10 items-end">
          <h2 className="text-[20vw] font-extrabold uppercase font-robo leading-[15vw] text-accent pt-2">
            Works
          </h2>
          <div className="space-y-6 pb-3">
            <p className="w-max text-wrap text-2xl dark:text-background text-foreground font-syne font-medium leading-snug">
              Explore my projects and <br /> witness how I elevate brands.
            </p>

            <MagneticButton
              className="bg-foreground dark:bg-background !w-max !h-max py-5 px-10 border-none cursor-pointer"
              textClassName="text-accent dark:text-accent"
              strengthText={0.12}
              strengthButton={0.2}
            >
              <span className="inline-flex items-center gap-2 font-black font-syne uppercase text-lg">
                Explore All{" "}
                <ModernArrow className="size-5 -rotate-35" strokeWidth={1.4} />
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>

      <CursorFollower
        cursorWrapperClassName="backdrop-blur-xl dark:bg-foreground/40 bg-background/40 rounded-full"
        cursor={
          <div className="relative size-48 rounded-full border border-accent flex items-center justify-center gap-2 text-accent">
            <IconAltArrowLeft width={2} className="size-6 wiggleleft" />
            <div className="size-4 dark:bg-background bg-foreground rounded-full" />
            <IconAltArrowRight width={2} className="size-6 wiggleright" />
          </div>
        }
      >
        <WorksCards />
      </CursorFollower>
    </div>
  );
};

export default Works;
