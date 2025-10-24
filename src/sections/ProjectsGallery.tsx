import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  image: string;
  href: string;
}

const projects: Project[] = [
  {
    title: "Brand Identity",
    image:
      "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    href: "/works",
  },
  {
    title: "Web Design",
    image: "https://source.unsplash.com/HtUBBdNDxpQ",
    href: "/works",
  },
  {
    title: "Lead Generation",
    image: "https://source.unsplash.com/D6odQjxbAjA",
    href: "/works",
  },
  {
    title: "Digital Marketing",
    image: "https://source.unsplash.com/-heLWtuAN3c",
    href: "/works",
  },
  {
    title: "Interactive Ads",
    image: "https://source.unsplash.com/PP8Escz15d8",
    href: "/works",
  },
  {
    title: "Video Production",
    image: "https://source.unsplash.com/D6odQjxbAjA",
    href: "/works",
  },
  {
    title: "E-Commerce",
    image:
      "https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    href: "/works",
  },
  {
    title: "3D Design",
    image:
      "https://images.unsplash.com/photo-1580215935060-a5adc57c5157?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    href: "/works",
  },
  {
    title: "Motion Design",
    image:
      "https://images.unsplash.com/photo-1505201372024-aedc618d47c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    href: "/works",
  },
];

const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryBoxRef = useRef<HTMLDivElement>(null);
  const galleryOuterRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const galleryBox = galleryBoxRef.current;
      const galleryOuter = galleryOuterRef.current;
      const heading = headingRef.current;

      if (!section || !galleryBox || !galleryOuter || !heading) return;

      const mm = gsap.matchMedia();

      // Reduced motion - static display
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([galleryOuter, heading], {
          autoAlpha: 1,
          clearProps: "transform",
        });
      });

      // Full motion - animated
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading fade in animation
        gsap.fromTo(
          heading,
          {
            autoAlpha: 0,
            y: 50,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
              end: "top 60%",
              scrub: 0.5,
            },
          }
        );

        // 3D carousel rotation animation with pinning
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=4000",
            scrub: 1.5,
            pin: galleryBox,
            anticipatePin: 1,
          },
        });

        tl.to(galleryOuter, {
          rotateY: -360,
          rotateX: 30,
          ease: "none",
        });

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="projects-gallery"
      ref={sectionRef}
      className="w-full relative py-20 md:py-32"
      style={{ minHeight: "100vh" }}
      aria-label="Projects Gallery"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-20 md:mb-32">
        <h2
          ref={headingRef}
          className="section-heading text-foreground dark:text-background text-center md:text-left"
        >
          Featured <span className="text-accent">Projects</span>
        </h2>
      </div>

      <div
        ref={galleryBoxRef}
        className="gallery_box w-full flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          minHeight: "60vh"
        }}
      >
        <div
          ref={galleryOuterRef}
          className="gallery_box_outer w-[280px] h-[180px] sm:w-[320px] sm:h-[200px] md:w-[400px] md:h-[260px] lg:w-[500px] lg:h-[320px] relative"
          style={{
            transform: "perspective(1200px) rotateX(-8deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="gallery_box_in group w-full h-full absolute bg-center bg-cover rounded-3xl bg-gray-300/50 dark:bg-gray-700/50 transition-transform duration-300 ease-out hover:scale-110"
              style={{
                backgroundImage: `url(${project.image})`,
                transform: `rotateY(${index * 40}deg) translateZ(400px)`,
              }}
            >
              <a
                href={project.href}
                className="flex items-center justify-center w-full h-full text-white font-robo relative overflow-hidden"
                aria-label={`View ${project.title} project`}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <h3 className="relative text-xl sm:text-2xl lg:text-3xl font-bold text-center drop-shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 z-10">
                  {project.title}
                </h3>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGallery;
