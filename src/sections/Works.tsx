import { useGSAP } from "@gsap/react";
import IconAltArrowRight from "../components/icons/AltArrowRight";
import MagneticButton from "../components/MagneticButton";
import CursorFollower from "../components/ui/CursroFollower";
import gsap from "gsap";
import { lazy, Suspense, useRef, useMemo } from "react";

const WorksCards = lazy(() => import("../components/WorksCards"));

const Works = () => {
  const selectedHeadingRef = useRef<HTMLHeadingElement>(null);
  const worksHeadingRef = useRef<HTMLHeadingElement>(null);
  const secondaryContainerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const worksdescRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const selected = selectedHeadingRef.current;
      const works = worksHeadingRef.current;
      const secondary = secondaryContainerRef.current;
      const worksDesc = worksdescRef.current;
      const wrapper = mainContainerRef.current;

      if (!wrapper || !selected || !works || !secondary || !worksDesc) return;

      const mm = gsap.matchMedia();
      const targets = [selected, works, worksDesc, secondary];

      // Reduced motion - static display
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          clearProps: "transform",
        });
      });

      // Full motion - animated
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Create wiggle animation helper
        const createWiggle = (selector: string, distance: number) =>
          gsap.to(selector, {
            x: distance,
            yoyo: true,
            repeat: -1,
            duration: 0.65,
            ease: "sine.inOut",
          });

        createWiggle(".wiggleleft", 5);
        createWiggle(".wiggleright", -5);

        // Add performance hint
        targets.forEach((el) => el.classList.add("will-change-transform"));

        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: "top 80%",
              end: "top 10%",
              scrub: 0.6,
            },
            defaults: { ease: "power1.inOut" },
            onComplete: () => {
              targets.forEach((el) =>
                el.classList.remove("will-change-transform"),
              );
            },
          })
          .fromTo(
            targets,
            {
              autoAlpha: 0,
              xPercent: 6,
              yPercent: 6,
              filter: "blur(10px)",
              rotationX: -45,
              transformPerspective: 1000,
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              rotationX: 0,
              filter: "blur(0px)",
              duration: 1,
              stagger: 0.8,
            },
          );

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: mainContainerRef },
  );

  const dragCursor = useMemo(
    () => (
      <div className="relative size-30 lg:size-40 rounded-full border border-accent flex items-center justify-center gap-2 text-accent">
        <IconAltArrowRight
          width={2}
          className="size-4 lg:size-6 wiggleleft rotate-180"
        />
        <span className="font-bold font-robo text-sm select-none text-center">
          DRAG <br />
          OR
          <br />
          CLICK
        </span>
        <IconAltArrowRight width={2} className="size-4 lg:size-6 wiggleright" />
      </div>
    ),
    [],
  );

  return (
    <section
      id="works"
      ref={mainContainerRef}
      className="w-full lg:space-y-8"
      aria-label="Selected Works"
    >
      <div className="px-4 md:px-6">
        <h2
          ref={selectedHeadingRef}
          className="section-heading text-foreground dark:text-background pt-2"
          style={{ transformStyle: "preserve-3d" }}
        >
          Selected
        </h2>
        <div className="inline-flex items-start md:items-end flex-col md:flex-row gap-[2vw]">
          <h2
            ref={worksHeadingRef}
            className="section-heading text-accent pt-2"
            style={{ transformStyle: "preserve-3d" }}
          >
            Works
          </h2>
          <div
            className="space-y-[1vw] lg:pb-3 grid grid-cols-2 md:block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p
              ref={worksdescRef}
              className="sm:max-w-[40ch] text-[clamp(0.9rem,1.5vw,1.35rem)] dark:text-background/70 text-foreground/70 font-robo leading-snug"
            >
              Step inside my projects—where <br className="hidden sm:block" />{" "}
              brands rise above the ordinary.
            </p>

            <div
              ref={secondaryContainerRef}
              className="place-self-end md:justify-self-auto"
            >
              <MagneticButton
                className="hidden md:inline-flex dark:bg-background bg-foreground cursor-pointer h-max py-[1.2vw] px-[4vw] group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/60 transition-colors"
                fillClassName="bg-accent"
                dataStrength={2.5}
                dataStrengthText={30}
                aria-label="Explore all works"
                href="/projects"
              >
                <span className="inline-flex items-center gap-2 font-bold uppercase text-sm lg:text-lg font-robo leading-none dark:text-foreground text-background group-hover:text-background dark:group-hover:text-background transition-colors duration-800 whitespace-nowrap">
                  Explore All
                </span>
              </MagneticButton>
              <a
                href="/projects"
                className="md:hidden inline-block py-2.5 px-6 bg-accent rounded-full font-bold uppercase text-sm font-robo leading-none text-background hover:text-background dark:hover:text-foreground transition-colors duration-500 whitespace-nowrap"
                aria-label="Explore all works"
              >
                Explore All
              </a>
            </div>
          </div>
        </div>
      </div>

      <CursorFollower
        cursorWrapperClassName="backdrop-blur-lg dark:bg-background/50 bg-foreground/40 rounded-full"
        cursor={dragCursor}
      >
        <Suspense
          fallback={
            <div className="h-[40vh] w-full flex items-center justify-center text-sm font-robo opacity-60">
              Loading works…
            </div>
          }
        >
          <WorksCards />
        </Suspense>
      </CursorFollower>
    </section>
  );
};

export default Works;
