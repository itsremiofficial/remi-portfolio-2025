import { memo, useCallback, useMemo } from "react";
import { cn } from "../../utils";
import Gallery from "../Gallery";
import IconArrowRight from "../icons/ArrowRight";
import { useScrollTo } from "../../hooks/useLenis";
import { CustomEase } from "gsap/all";

const GalleryMarquee = memo(() => {
  const { scrollToElement } = useScrollTo();
  const ease = useMemo(
    () => CustomEase.create("galleryEase", "0.7, 0, 0.2, 1"),
    [],
  );

  const handleSeeMoreClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollToElement("projects-gallery", {
        offset: -100,
        duration: 2.5,
        easing: (t: number): number => ease(t),
      });
    },
    [scrollToElement, ease],
  );
  return (
    <div
      className={cn(
        "flex items-center justify-center marquee-item rounded-xl",
        "md:px-8 md:py-4",
        "min-w-[350px] md:min-w-[450px]",
        "text-foreground dark:text-background",
      )}
    >
      <div className="inline-flex gap-4 items-center">
        <div className="dark:bg-foreground bg-white/60 border border-foreground/15 dark:border-background/10 overflow-hidden h-24 md:h-32 w-40 md:w-52 inline-flex justify-center squircle rounded-3xl">
          <div className="flex !justify-center !items-center h-24 md:h-32">
            <Gallery
              className="h-full flex !justify-center !items-center"
              autoPlay={true}
              muted={true}
              playsInline={true}
            />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-sm w-max md:text-xl font-medium text-foreground dark:text-background">
            Selected Work
          </span>
          <p className="text-balance w-48 text-foreground/70 dark:text-background/70 text-xs">
            Recent projects showcasing creativity, quality, and innovation.
          </p>
          <a
            href="#projects-gallery"
            onClick={handleSeeMoreClick}
            className={cn(
              "mt-3 flex items-center gap-2 text-xs md:text-sm font-medium cursor-pointer relative",
              "w-28 md:w-34 h-6 md:h-8 group/cta",
              "text-foreground dark:text-background transition-colors duration-300",
            )}
          >
            <span className="rounded-full w-full p-1 md:ml-0.5 absolute z-10 group-hover/cta:-ml-1.5 group-hover/cta:translate-x-3/4 transition-all duration-300 text-background">
              <IconArrowRight className="size-4 md:size-5" duotone={false} />
            </span>
            <div className="relative ml-8 md:ml-12 z-10 group-hover/cta:ml-4 transition-all duration-300  group-hover/cta:text-background">
              See more
            </div>
            <div className="absolute left-0 h-full w-6 md:w-8 aspect-square bg-accent z-0 rounded-full group-hover/cta:w-full transition-[width] duration-300"></div>
          </a>
        </div>
      </div>
    </div>
  );
});

export default GalleryMarquee;
