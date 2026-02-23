import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import PROJECTS, { type Project } from "../constants/PROJECTS";
import ImageDistortion from "../components/ImageDistortion";
import Header from "../layout/Header";
import MacCursorAuto from "../components/ui/MacCursorAuto";

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
      <MacCursorAuto />
      <div className="grain" />
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
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-20">
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
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

const ProjectCard = ({
  work,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="project-card group cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-foreground/5 dark:bg-background/5">
        {/* Image with shader distortion */}
        <ImageDistortion
          imageUrl={work.imageUrl}
          isHovered={isHovered}
          className="w-full h-full object-cover"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Year badge */}
        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-robo font-bold">
          {work.year}
        </div>

        {/* Type badge */}
        <div className="absolute top-4 left-4 bg-background/90 dark:bg-foreground/90 backdrop-blur-sm text-foreground dark:text-background px-3 py-1 rounded-full text-sm font-robo font-bold uppercase">
          {work.type}
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-white text-3xl md:text-4xl font-grandbold uppercase tracking-wider mb-2">
            {work.title}
          </h3>
          <p className="text-white/80 text-sm font-robo line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {work.description}
          </p>
          {work.technologies && (
            <div className="flex flex-wrap gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
              {work.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-robo text-white/70 bg-white/10 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hover effect line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
      </div>
    </div>
  );
};

export default Projects;
