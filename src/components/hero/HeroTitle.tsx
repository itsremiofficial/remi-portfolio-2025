import { memo } from "react";
import AsteriskCircleAnimated from "../ui/AsteriskCircleAnimated";

const HeroTitle = memo(
  ({
    active,
    onEnter,
    onLeave,
  }: {
    active: boolean;
    onEnter: () => void;
    onLeave: () => void;
  }) => (
    <h1
      className="font-robo font-var mt-4 text-[16vw] sm:text-[18vw] md:text-[13vw] lg:!text-[10vw] text-wrap font-medium leading-none tracking-wide group/hero text-center text-foreground/40 dark:text-background/40 uppercase"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      I Turn <br className="block lg:hidden" />
      <span className="text-foreground dark:text-background">
        Imaginations
      </span>{" "}
      <br />
      <span className="text-foreground dark:text-background">Into</span>
      <div className="inline-flex px-4 lg:px-10">
        <AsteriskCircleAnimated active={active} />
      </div>
      <br className="block lg:hidden" />
      Interactive
      <br />
      Digital <br className="block lg:hidden" />
      <span className="text-foreground dark:text-background">Experiences</span>
    </h1>
  )
);

export default HeroTitle;
