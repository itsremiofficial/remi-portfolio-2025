import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import WORKS from "../constants/WORKS";
import type { Work } from "../constants/WORKS";
import IconAltArrowRight from "../components/icons/AltArrowRight";
import MagneticButton from "../components/MagneticButton";
import { useScrollTo } from "../hooks/useLenis";
import MagneticItem from "../components/MagneticItem";
import MagneticButtonCircular from "../components/MagneticButtonCircular";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { scrollToElement, scrollToTop, isReady } = useScrollTo();

  // Create custom ease for smooth scrolling
  const ease = useMemo(() => CustomEase.create("custom", "0.7, 0, 0.2, 1"), []);

  // Find current project and calculate prev/next
  const { project, prevProject, nextProject, projectIndex } = useMemo<{
    project: Work | null;
    prevProject: Work | null;
    nextProject: Work | null;
    projectIndex: number;
  }>(() => {
    const index = WORKS.findIndex((work) => work.slug === slug);
    if (index === -1) {
      return {
        project: null,
        prevProject: null,
        nextProject: null,
        projectIndex: -1,
      };
    }

    const prevIndex = index === 0 ? WORKS.length - 1 : index - 1;
    const nextIndex = index === WORKS.length - 1 ? 0 : index + 1;

    return {
      project: WORKS[index],
      prevProject: WORKS[prevIndex],
      nextProject: WORKS[nextIndex],
      projectIndex: index,
    };
  }, [slug]);

  // Redirect if project not found
  useEffect(() => {
    if (!project) {
      navigate("/");
      const scrollToWorks = (attempts = 0) => {
        const worksElement = document.getElementById("works");
        if (worksElement) {
          scrollToElement("works", {
            offset: -100,
            duration: 2.5,
            easing: (t: number): number => ease(t),
          });
        } else if (attempts < 10) {
          setTimeout(() => scrollToWorks(attempts + 1), 100);
        }
      };
      setTimeout(() => scrollToWorks(), 200);
    }
  }, [project, navigate, scrollToElement, ease]);

  // Scroll to top when project changes
  useEffect(() => {
    if (isReady) {
      scrollToTop({ duration: 0, immediate: true });
    } else {
      // Fallback to native scroll if Lenis not ready
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [slug, scrollToTop, isReady]);

  // GSAP entrance animation
  useGSAP(() => {
    if (!project) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".project-header", {
      autoAlpha: 0,
      y: 50,
      duration: 0.8,
    })
      .from(
        ".project-image",
        {
          autoAlpha: 0,
          scale: 0.95,
          duration: 1,
        },
        "-=0.4"
      )
      .from(
        ".project-content",
        {
          autoAlpha: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
        },
        "-=0.5"
      )
      .from(
        ".project-nav",
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.5,
        },
        "-=0.3"
      );
  }, [project]);

  if (!project) return null;

  const handleClose = () => {
    // Store scroll target in sessionStorage before navigation
    sessionStorage.setItem("scrollToSection", "works");

    // Navigate to home page
    navigate("/");
  };

  const handlePrevious = () => {
    if (prevProject) {
      navigate(`/work/${prevProject.slug}`);
      // Scroll to top will be handled by useEffect
    }
  };

  const handleNext = () => {
    if (nextProject) {
      navigate(`/work/${nextProject.slug}`);
      // Scroll to top will be handled by useEffect
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-foreground dark:text-background">
      {/* Close Button */}
      <div className="fixed top-8 right-8 z-50">
        <MagneticButtonCircular
          className="hidden md:inline-flex bg-white text-accent hover:text-white cursor-pointer h-max p-[1.2vw] group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/60 transition-colors"
          fillClassName="bg-accent"
          dataStrength={2.5}
          dataStrengthText={30}
          onClick={handleClose}
          aria-label="Close project"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </MagneticButtonCircular>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 lg:py-32">
        {/* Project Header */}
        <div className="project-header mb-12 lg:mb-20">
          <div className="flex items-center gap-4 mb-6 text-sm lg:text-base text-accent uppercase tracking-wider">
            <span>{project.type}</span>
            <span>•</span>
            <span>{project.year}</span>
            <span>•</span>
            <span>
              {projectIndex + 1} / {WORKS.length}
            </span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-grandbold uppercase tracking-wider mb-6">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-xl lg:text-2xl text-foreground/70 dark:text-background/70 max-w-3xl">
              {project.description}
            </p>
          )}
        </div>

        {/* Project Image */}
        <div className="project-image mb-12 lg:mb-20 relative aspect-video overflow-hidden rounded-2xl">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="project-content">
              <h2 className="text-2xl lg:text-3xl font-grandbold uppercase tracking-wider mb-6">
                Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm lg:text-base font-robo"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="project-content">
            <h2 className="text-2xl lg:text-3xl font-grandbold uppercase tracking-wider mb-6">
              Links
            </h2>
            <div className="flex flex-col gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <span>View Live Site</span>
                  <IconAltArrowRight className="size-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <span>View on GitHub</span>
                  <IconAltArrowRight className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="project-nav flex items-center justify-between border-t border-foreground/20 dark:border-background/20 pt-12">
          {/* Previous Project */}
          <MagneticItem
            dataStrength={0.2}
            onClick={handlePrevious}
            className="[&>span]:flex cursor-pointer items-center gap-4 hover:text-accent transition-colors duration-300 overflow-visible"
          >
            <div className="rotate-180">
              <IconAltArrowRight className="size-8 lg:size-12 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
            <div className="text-left">
              <div className="text-sm text-foreground/50 dark:text-background/50 uppercase tracking-wider mb-1">
                Previous
              </div>
              <div className="text-xl lg:text-2xl font-grandbold uppercase">
                {prevProject?.title}
              </div>
            </div>
          </MagneticItem>

          {/* Next Project */}
          <MagneticItem
            dataStrength={0.1}
            onClick={handleNext}
            className="[&>span]:flex cursor-pointer items-center gap-4 hover:text-accent transition-colors duration-300 overflow-visible"
          >
            <div className="text-right">
              <div className="text-sm text-foreground/50 dark:text-background/50 uppercase tracking-wider mb-1">
                Next
              </div>
              <div className="text-xl lg:text-2xl font-grandbold uppercase">
                {nextProject?.title}
              </div>
            </div>
            <IconAltArrowRight className="size-8 lg:size-12 group-hover:translate-x-2 transition-transform duration-300" />
          </MagneticItem>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
