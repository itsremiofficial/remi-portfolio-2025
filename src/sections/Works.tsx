import { useGSAP } from "@gsap/react";
import IconAltArrowLeft from "../components/icons/AltArrowLeft";
import IconAltArrowRight from "../components/icons/AltArrowRight";
import MagneticButton from "../components/MagneticButton";
import CursorFollower from "../components/ui/CursroFollower";
import gsap from "gsap";
import { lazy, Suspense, useMemo, useRef } from "react";

const WorksCards = lazy(() => import("../components/WorksCards"));

const Works = () => {
  const selectedHeadingRef = useRef<HTMLHeadingElement>(null);
  const worksHeadingRef = useRef<HTMLHeadingElement>(null);
  const secondaryContainerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context) => {
      const selected = selectedHeadingRef.current;
      const works = worksHeadingRef.current;
      const secondary = secondaryContainerRef.current;
      const wrapper = mainContainerRef.current;
      if (!wrapper || !selected || !works || !secondary) return;

      // Create a matchMedia instance (no argument)
      const mm = gsap.matchMedia();

      // Reduced motion
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([selected, works, secondary], {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          clearProps: "transform",
        });
      });

      // Full motion
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Wiggles
        const wiggle = (selector: string, distance: number) =>
          gsap.to(selector, {
            x: distance,
            yoyo: true,
            repeat: -1,
            duration: 0.65,
            ease: "sine.inOut",
          });

        wiggle(".wiggleleft", 5);
        wiggle(".wiggleright", -5);

        const targets: HTMLElement[] = [selected, works, secondary];
        targets.forEach((el) => el.classList.add("will-change-transform"));

        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: "top 85%",
              end: "top 20%",
              scrub: 0.6,
            },
            defaults: { ease: "power1.inOut" },
          })
          .fromTo(
            targets,
            {
              autoAlpha: 0,
              xPercent: 10,
              yPercent: 10,
              inertia: {
                x: 100,
                y: 100,
              },
              rotationX: -45,
              transformPerspective: 1000,
              stagger: 0.08,
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              rotationX: 0,
              duration: 1,
              stagger: 0.08,
            }
          );

        tl.eventCallback("onComplete", () =>
          targets.forEach((el) => el.classList.remove("will-change-transform"))
        );

        // Return a cleanup for this media query branch
        return () => {
          tl.kill();
        };
      });

      // Global cleanup (revert matchMedia when component unmounts)
      return () => {
        mm.revert(); // kills all mm-added tweens/ScrollTriggers inside
      };
    },
    { scope: mainContainerRef } // IMPORTANT: restores proper scoping & auto cleanup
  );

  const dragCursor = useMemo(
    () => (
      <div className="relative size-30 lg:size-40 rounded-full border border-accent flex items-center justify-center gap-2 text-accent">
        <IconAltArrowLeft width={2} className="size-4 lg:size-6 wiggleleft" />
        <span className="font-bold font-robo text-sm select-none">DRAG</span>
        <IconAltArrowRight width={2} className="size-4 lg:size-6 wiggleright" />
      </div>
    ),
    []
  );

  return (
    // If you want semantic landmark: change to <section aria-labelledby="selected-works-heading">
    <section
      id="works"
      ref={mainContainerRef}
      className="w-full lg:space-y-8"
      aria-labelledby="selected-works-heading"
    >
      <div className="px-4 md:px-6">
        {/* Optionally uncomment for a single accessible heading: */}
        <h2 id="selected-works-heading" className="sr-only">
          Selected Works
        </h2>

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
            ref={secondaryContainerRef}
            className="space-y-[1vw] lg:pb-3 grid grid-cols-2 md:block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p className="sm:max-w-[40ch] text-[clamp(0.9rem,1.5vw,1.35rem)] dark:text-background/70 text-foreground/70 font-robo leading-snug">
              Step inside my projects—where <br className="hidden sm:block" />{" "}
              brands rise above the ordinary.
            </p>

            <div className="place-self-end md:justify-self-auto">
              <MagneticButton
                className="hidden md:inline-flex dark:bg-background bg-foreground cursor-pointer h-max py-[1.2vw] px-[4vw] group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/60 transition-colors"
                fillClassName="bg-accent"
                dataStrength={2.5}
                dataStrengthText={30}
                aria-label="Explore all works"
                href="/works"
              >
                <span className="inline-flex items-center gap-2 font-bold uppercase text-sm lg:text-lg font-robo leading-none dark:text-foreground text-background group-hover:text-background dark:group-hover:text-background transition-colors duration-800 whitespace-nowrap">
                  Explore All
                </span>
              </MagneticButton>
              <div className="md:hidden py-2.5 px-6 bg-accent rounded-full">
                <a
                  href="#all-works"
                  className="font-bold uppercase text-sm lg:text-lg font-robo leading-none text-background hover:text-background dark:hover:text-foreground transition-colors duration-500 whitespace-nowrap"
                >
                  Explore All
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CursorFollower
        cursorWrapperClassName="backdrop-blur-lg dark:bg-foreground/50 bg-background/40 rounded-full"
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
