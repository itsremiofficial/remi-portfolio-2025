import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import PROJECTS, { type Project } from "../constants/PROJECTS";
import ImageDistortion from "../components/ImageDistortion";
import Header from "../layout/Header";
import IconStarish from "../components/icons/Starish";

// ===== CONSTANTS =====
const ANIMATION_CONFIG = {
  STAGGER: 0.1,
  DURATION: 1.2,
  EASE: "power3.out",
} as const;

// ===== COMPONENT =====
const Projects = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Entrance animations
  useEffect(() => {
    if (!containerRef.current || !headingRef.current) return;

    const ctx = gsap.context(() => {
      // Animate heading
      gsap.fromTo(
        headingRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: ANIMATION_CONFIG.DURATION,
          ease: ANIMATION_CONFIG.EASE,
        },
      );

      // Animate project cards
      gsap.fromTo(
        ".project-card",
        {
          y: 100,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: ANIMATION_CONFIG.DURATION,
          stagger: ANIMATION_CONFIG.STAGGER,
          ease: ANIMATION_CONFIG.EASE,
          scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Parallax effect on scroll
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.to(card, {
          y: -50,
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleProjectClick = (slug: string) => {
    navigate(`/projects/${slug}`);
  };

  return (
    <>
      <Header fontsLoaded={true} />

      <div
        ref={containerRef}
        className="min-h-screen bg-background dark:bg-foreground text-foreground dark:text-background relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 pt-20 pb-12 px-6 md:px-12 lg:px-20">
          <h1
            ref={headingRef}
            className="text-6xl md:text-8xl lg:text-9xl font-grandbold uppercase tracking-wider text-center"
          >
            All Projects
          </h1>
          <p className="text-center text-lg md:text-xl mt-6 font-robo opacity-70 max-w-2xl mx-auto">
            Explore our collection of creative works and innovative solutions
          </p>
        </div>

        {/* Projects Grid */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 py-28">
          <div className="projects-grid grid grid-cols-1 gap-8 md:gap-12 max-w-5xl mx-auto">
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                work={project}
                isHovered={hoveredId === project.id}
                onHover={() => setHoveredId(project.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => handleProjectClick(project.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ===== PROJECT CARD COMPONENT =====
interface ProjectCardProps {
  work: Project;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const ProjectCard = ({ work, onHover, onLeave, onClick }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="project-card group cursor-pointer my-36"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="relative aspect-[16/9] rounded-2xl bg-foreground/5 dark:bg-background/5">
        {/* Image with shader distortion */}
        <ImageDistortion
          imageUrl={work.imageUrl}
          className="absolute inset-0 w-full h-full"
        />
        <h3 className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-accent text-3xl md:text-8xl font-black uppercase mb-2 font-grandbold tracking-tight flex gap-4 whitespace-nowrap">
          <span className="font-script text-9xl">{work.title.charAt(0)}</span>{" "}
          <span className="">{work.title.slice(1)}</span>
        </h3>

        {/* Year badge */}
        <div className="absolute bottom-14 group-hover:bottom-16 left-1/2 -translate-x-1/2 text-center bg-background/10 backdrop-blur-lg text-white px-3 py-1 text-sm font-inter opacity-0 group-hover:opacity-100 transition-[opacity, transform] duration-500">
          <span className="mix-blend-hard-light">{work.description}</span>
        </div>

        {/* Type badge */}
        <div className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-500 top-4 left-4 bg-foreground/20 dark:bg-background/40 backdrop-blur-sm saturate-200 text-white dark:text-background px-4 py-1.5 rounded-full text-xs font-robo uppercase flex items-center gap-2 border border-primary/15">
          {work.type}{" "}
          <IconStarish className="size-4 rotate-45 text-white dark:text-foreground" />
          {work.year}
        </div>

        {/* Hover effect line */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" /> */}
      </div>
    </div>
  );
};

export default Projects;
