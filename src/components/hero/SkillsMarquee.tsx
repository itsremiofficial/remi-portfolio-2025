import { memo } from "react";
import { cn } from "../../utils";
import IconArrowRight from "../icons/ArrowRight";

// Extracted reusable pill component
const Pill = memo(({ text }: { text: string }) => (
  <span
    className={cn(
      "text-xs md:text-sm leading-snug whitespace-nowrap",
      "px-3 md:px-5 py-0.5 md:py-1.5",
      "border rounded-full border-foreground/15 dark:border-background/20",
      "pointer-events-none select-none bg-white/50 dark:bg-transparent"
    )}
  >
    {text}
  </span>
));

const SkillsMarquee = memo(
  ({ onSkillClick }: { onSkillClick: (id: string) => void }) => {
    return (
      <div
        className={cn(
          "flex items-center justify-center marquee-item rounded-xl",
          "md:px-8 md:py-4",
          "min-w-[350px] md:min-w-[450px]",
          "text-foreground dark:text-background"
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Pill text="Design" />
            <Pill text="Development" />
            <Pill text="Animation" />
          </div>
          <div className="flex items-center gap-2">
            <Pill text="User Interface" />
            <Pill text="GSAP" />
            <span
              className={cn(
                "text-xs md:text-sm leading-snug whitespace-nowrap relative",
                "px-3 md:px-5 py-0.5 md:py-1.5",
                "border rounded-full border-foreground/15 dark:border-background/20",
                "select-none bg-white/50 dark:bg-transparent",
                "hover:border-accent hover:bg-accent hover:text-background",
                "pill5 group/arrow relative overflow-hidden min-w-max",
                "transition-all duration-300 cursor-pointer group/arrow"
              )}
              onClick={() => onSkillClick("skills")}
            >
              <span className="relative z-10 inline-flex items-center gap-[0.4vw] group-hover/arrow:gap-[1vw] transition-all duration-300">
                More{" "}
                <IconArrowRight
                  className="size-3.5 md:size-4"
                  duotone={false}
                />
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export default SkillsMarquee;
