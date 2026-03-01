import { assetUrl } from "../utils/assetUrl";

export interface Project {
  id: string;
  title: string;
  type: string;
  slug: string;
  imageUrl: string;
  year: string;
  description?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
}

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Fronus Solar Energy",
    type: "Corporate Website",
    slug: "fronus-solar",
    imageUrl: assetUrl("/projects/fronus.avif"),
    year: "2024",
    description:
      "A premium corporate website for a solar energy leader, featuring immersive product showcases and sustainable energy solutions.",
    technologies: ["React", "GSAP", "Tailwind", "WebGL"],
  },
  {
    id: "2",
    title: "Mivator Pro",
    type: "SaaS Platform",
    slug: "mivator-pro",
    imageUrl: assetUrl("/projects/mivatorproweb.avif"),
    year: "2023",
    description:
      "A high-performance SaaS platform website with advanced animations and a seamless user experience for enterprise clients.",
    technologies: ["Next.js", "Framer Motion", "TypeScript"],
  },
  {
    id: "4",
    title: "TravlApp",
    type: "Travel App",
    slug: "travlapp",
    imageUrl: assetUrl("/projects/travlapp.avif"),
    year: "2024",
    description:
      "An eco-conscious digital presence for a renewable energy provider, highlighting sustainability through organic design and smooth transitions.",
    technologies: ["Vue.js", "Nuxt", "SCSS"],
  },
  {
    id: "5",
    title: "UX Creatives",
    type: "Agency Website",
    slug: "uxcreatives",
    imageUrl: assetUrl("/projects/uxcreatives.avif"),
    year: "2024",
    description:
      "A comprehensive analytics dashboard with real-time data visualization, dark mode support, and intuitive data grids.",
    technologies: ["React", "D3.js", "Material UI", "Redux"],
  },
  {
    id: "6",
    title: "Calyptus",
    type: "Software Agency",
    slug: "calyptus",
    imageUrl: assetUrl("/projects/calyptus.avif"),
    year: "2024",
    description:
      "A dynamic agency portfolio featuring 3D interactive elements and a modern, dark-themed aesthetic.",
    technologies: ["React", "Three.js", "Styled Components"],
  },
  {
    id: "7",
    title: "Logo Diffusion",
    type: "Software Agency",
    slug: "logodiffusion",
    imageUrl: assetUrl("/projects/logodiffusion.avif"),
    year: "2024",
    description:
      "A dynamic agency portfolio featuring 3D interactive elements and a modern, dark-themed aesthetic.",
    technologies: ["React", "Three.js", "Styled Components"],
  },
];

export default PROJECTS;
