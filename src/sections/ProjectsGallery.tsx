import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MagneticButton from "../components/MagneticButton";
import { useTheme } from "../hooks/useTheme";
import type { Project } from "../constants/PROJECTS";
import Scene from "../components/ProjectsCarousel/Scene";
import ProjectInfoPanel from "../components/ProjectsCarousel/ProjectInfoPanel";
import type { CarouselState } from "../components/ProjectsCarousel/types";
import { useIsMobile } from "../hooks/useIsMobile";
import PROJECTS from "../constants/PROJECTS";
import ProjectCard from "../components/ProjectsCarousel/ProjectCard";

// ── Module-level constants ──────────────────────────────────────────────────
const CAMERA_FOV = 18;
const PANEL_WIDTH = 350;
const PANEL_PADDING = 40;

/** First N projects shown on mobile (avoids allocating a new array every render). */
const MOBILE_PROJECTS = PROJECTS.slice(0, 3);

/** Static Canvas GL config — hoisted so the identity is stable across renders. */
const GL_CONFIG = {
  antialias: true,
  alpha: true,
  premultipliedAlpha: false,
  powerPreference: "high-performance" as const,
  preserveDrawingBuffer: false,
};

/** Static Canvas camera config. */
const CAMERA_CONFIG = { position: [0, 0, 100] as const, fov: CAMERA_FOV };

/** Static Canvas inline style. */
const CANVAS_STYLE: React.CSSProperties = {
  background: "transparent",
  width: "100%",
  height: "100%",
  cursor: "grab",
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Determine which side of the cursor the info-panel should appear on. */
const getPanelSide = (cursorX: number): "left" | "right" => {
  const spaceOnRight = window.innerWidth - cursorX;
  if (spaceOnRight >= PANEL_WIDTH + PANEL_PADDING) return "right";
  if (cursorX >= PANEL_WIDTH + PANEL_PADDING) return "left";
  return spaceOnRight > cursorX ? "right" : "left";
};

/** Reset the cursor on dragging canvas element */
const resetDragCursor = (e: React.PointerEvent) => {
  (e.target as HTMLCanvasElement).style.cursor = "grab";
};

// ── Main Component ──────────────────────────────────────────────────────────
const ProjectsGallery = () => {
  // — Refs: DOM elements ------------------------------------------------------
  const projectsSectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const projectsSelectedHeadingRef = useRef<HTMLHeadingElement>(null);
  const projectsGalleryHeadingRef = useRef<HTMLHeadingElement>(null);
  const projectsSecondaryContainerRef = useRef<HTMLDivElement>(null);
  const projectsHeaderContainerRef = useRef<HTMLDivElement>(null);
  const projectsDescRef = useRef<HTMLParagraphElement>(null);

  // — Refs: drag tracking (mutable, no re-render) ----------------------------
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const lastMouseX = useRef(0);
  const currentMouseX = useRef(0);
  const currentMouseY = useRef(0);

  // — Refs: 3-D carousel shared state ----------------------------------------
  const carouselState = useRef<CarouselState>({
    scrollProgress: 0,
    dragRotation: 0,
    isDragging: false,
    autoRotation: 0,
    autoRotationDirection: 1,
  });

  // — Refs: GSAP quickTo tweens & active tracking ----------------------------
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const isActiveRef = useRef(false);

  // — Theme / responsive -----------------------------------------------------
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  // — State (only what truly needs to trigger a render) -----------------------
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [panelSide, setPanelSide] = useState<"left" | "right">("right");
  const [isActive, setIsActive] = useState(false);

  // Keep the ref in sync so callbacks stay stable.
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // — Scroll progress tracking ------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const section = projectsSectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));

      carouselState.current.scrollProgress = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial calculation
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // — GSAP quickTo initialisation ---------------------------------------------
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.set(panel, { x: 0, y: 0 });
    quickX.current = gsap.quickTo(panel, "x", {
      duration: 1,
      ease: "power3.out",
    });
    quickY.current = gsap.quickTo(panel, "y", {
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  // — Snap panel to cursor when hovering starts -------------------------------
  useEffect(() => {
    if (isActive && panelRef.current && quickX.current && quickY.current) {
      quickX.current(currentMouseX.current);
      quickY.current(currentMouseY.current);
      setPanelSide(getPanelSide(currentMouseX.current));
    }
  }, [isActive]);

  // — Pointer callbacks (stable — no state in dependency arrays) ─────────────
  const handleProjectHover = useCallback((data: Project) => {
    setHoveredProject(data);
    setIsActive(true);
  }, []);

  const handleProjectHoverEnd = useCallback(() => {
    setHoveredProject(null);
    setIsActive(false);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    carouselState.current.isDragging = true;
    dragStartX.current = e.clientX;
    lastMouseX.current = e.clientX;
    dragStartRotation.current = carouselState.current.dragRotation;
    (e.target as HTMLCanvasElement).style.cursor = "grabbing";
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    // Track current mouse position for panel snapping on hover-start.
    currentMouseX.current = e.clientX;
    currentMouseY.current = e.clientY;

    const deltaX = e.clientX - lastMouseX.current;

    // Update auto-rotation direction based on drag direction.
    if (Math.abs(deltaX) > 0.5) {
      carouselState.current.autoRotationDirection = deltaX > 0 ? 1 : -1;
    }

    if (carouselState.current.isDragging) {
      const totalDeltaX = e.clientX - dragStartX.current;
      carouselState.current.dragRotation =
        dragStartRotation.current +
        (totalDeltaX / window.innerWidth) * Math.PI * 2;
    }

    // Smooth-follow the cursor with the info panel (read ref, not state).
    if (isActiveRef.current && quickX.current && quickY.current) {
      quickX.current(e.clientX);
      quickY.current(e.clientY);
      setPanelSide(getPanelSide(e.clientX));
    }

    lastMouseX.current = e.clientX;
  }, []); // ← stable: reads refs only

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    carouselState.current.isDragging = false;
    resetDragCursor(e);
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    if (carouselState.current.isDragging) {
      carouselState.current.isDragging = false;
      resetDragCursor(e);
    }
  }, []);

  // — Header scroll-in animation (GSAP + ScrollTrigger) -----------------------
  useGSAP(
    () => {
      const selected = projectsSelectedHeadingRef.current;
      const gallery = projectsGalleryHeadingRef.current;
      const secondary = projectsSecondaryContainerRef.current;
      const projectsDesc = projectsDescRef.current;
      const wrapper = projectsHeaderContainerRef.current;

      if (!wrapper || !selected || !gallery || !secondary || !projectsDesc)
        return;

      const mm = gsap.matchMedia();
      const targets = [selected, gallery, projectsDesc, secondary];

      // Reduced motion — static display
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          clearProps: "transform",
        });
      });

      // Full motion — animated
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        targets.forEach((el) => el.classList.add("will-change-transform"));

        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: "top 80%",
              end: "top 30%",
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
              xPercent: 12,
              yPercent: 12,
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
              stagger: 0.1,
            },
          );

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: projectsHeaderContainerRef },
  );

  // — Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      id="projects-gallery"
      ref={projectsSectionRef}
      className="relative w-full overflow-visible"
      aria-label="Projects Gallery"
    >
      <div ref={projectsHeaderContainerRef} className="px-4 md:px-6">
        <h2
          ref={projectsSelectedHeadingRef}
          className="section-heading text-foreground dark:text-background pt-2"
          style={{ transformStyle: "preserve-3d" }}
        >
          Selected
        </h2>
        <div className="inline-flex items-start md:items-end flex-col md:flex-row gap-[2vw]">
          <h2
            ref={projectsGalleryHeadingRef}
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
              ref={projectsDescRef}
              className="sm:max-w-[40ch] text-[clamp(0.9rem,1.5vw,1.35rem)] dark:text-background/70 text-foreground/70 font-robo leading-snug"
            >
              Step inside my projects—where <br className="hidden sm:block" />{" "}
              brands rise above the ordinary.
            </p>

            <div
              ref={projectsSecondaryContainerRef}
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

      {isMobile === undefined ? null : isMobile ? (
        <div className="w-full p-4 space-y-4">
          {MOBILE_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div
          className="top-0 left-0 w-full z-10"
          style={{ aspectRatio: "16 / 9", maxWidth: "2560px" }}
        >
          <Canvas
            camera={CAMERA_CONFIG}
            frameloop="always"
            gl={GL_CONFIG}
            style={CANVAS_STYLE}
            dpr={[1, 2]}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          >
            <Scene
              onHover={handleProjectHover}
              onHoverEnd={handleProjectHoverEnd}
              fov={CAMERA_FOV}
              isDark={isDark}
              carouselState={carouselState}
            />
          </Canvas>

          <ProjectInfoPanel
            ref={panelRef}
            hoveredProject={hoveredProject}
            isActive={isActive}
            panelSide={panelSide}
          />
        </div>
      )}
    </section>
  );
};

export default ProjectsGallery;
