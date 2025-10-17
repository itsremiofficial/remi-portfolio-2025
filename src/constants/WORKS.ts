export interface Work {
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
}

const WORKS: Work[] = [
  {
    id: "1",
    title: "Mivator",
    type: "Dashboard",
    slug: "mivator-dashboard",
    imageUrl: "/videos/video01.jpg",
    year: "2024",
    description:
      "A modern dashboard application with real-time analytics and data visualization.",
    technologies: ["React", "TypeScript", "GSAP"],
  },
  {
    id: "2",
    title: "Fronus",
    type: "Website",
    slug: "fronus-website",
    imageUrl: "/videos/video02.jpg",
    year: "2023",
    description:
      "A sleek corporate website with smooth animations and interactive elements.",
    technologies: ["React", "GSAP", "Tailwind"],
  },
  {
    id: "3",
    title: "Mivator",
    type: "Website",
    slug: "mivator-website",
    imageUrl: "/videos/video03.jpg",
    year: "2024",
    description:
      "An engaging website showcasing product features and capabilities.",
    technologies: ["React", "TypeScript", "GSAP"],
  },
  {
    id: "4",
    title: "Project",
    type: "Website",
    slug: "portfolio-project",
    imageUrl: "/videos/portfolio01.jpg",
    year: "2024",
    description: "A creative portfolio showcasing design and development work.",
    technologies: ["React", "GSAP", "WebGL"],
  },
  {
    id: "5",
    title: "Mivator",
    type: "Dashboard",
    slug: "mivator-dashboard-v2",
    imageUrl: "/videos/video01.jpg",
    year: "2024",
    description:
      "Enhanced version of the Mivator dashboard with advanced features.",
    technologies: ["React", "TypeScript", "GSAP"],
  },
  {
    id: "6",
    title: "Fronus",
    type: "Website",
    slug: "fronus-redesign",
    imageUrl: "/videos/video02.jpg",
    year: "2023",
    description: "Redesigned Fronus website with improved user experience.",
    technologies: ["React", "GSAP", "Tailwind"],
  },
  {
    id: "7",
    title: "Mivator",
    type: "Website",
    slug: "mivator-landing",
    imageUrl: "/videos/video03.jpg",
    year: "2024",
    description: "A captivating landing page with immersive animations.",
    technologies: ["React", "TypeScript", "GSAP"],
  },
  {
    id: "8",
    title: "Project",
    type: "Website",
    slug: "creative-showcase",
    imageUrl: "/videos/portfolio01.jpg",
    year: "2024",
    description:
      "An experimental project pushing the boundaries of web animations.",
    technologies: ["React", "GSAP", "Three.js"],
  },
];

export default WORKS;
