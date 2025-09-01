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
            <p className="w-max text-wrap text-[1.5vw] dark:text-background text-foreground font-syne font-bold leading-snug">
              Explore my <br /> projects and witness <br />
              how I elevate brands.
            </p>

            <MagneticButton
              className="bg-accent cursor-pointer py-5 px-14 group rounded-full"
              fillClassName="dark:bg-background bg-foreground"
              dataStrength={30}
              dataStrengthText={20}
            >
              <span className="inline-flex items-center gap-2 font-bold uppercase text-lg font-robo leading-none text-balance text-background dark:text-accent group-hover:text-background transition-colors duration-500">
                Explore All
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
