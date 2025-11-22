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
  videoUrl?: string;
}

const WORKS: Work[] = [
  {
    id: "1",
    title: "Fronus Solar Energy",
    type: "Corporate Website",
    slug: "fronus-solar",
    imageUrl: "/videos/fronus.png",
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
    imageUrl: "/videos/mivatorproweb.png",
    year: "2023",
    description:
      "A high-performance SaaS platform website with advanced animations and a seamless user experience for enterprise clients.",
    technologies: ["Next.js", "Framer Motion", "TypeScript"],
  },
  {
    id: "3",
    title: "Mivator Pro",
    type: "Analytics Platform",
    slug: "mivator-dashboard",
    imageUrl: "/videos/mivatorprodash.png",
    year: "2024",
    description:
      "A comprehensive analytics dashboard with real-time data visualization, dark mode support, and intuitive data grids.",
    technologies: ["React", "D3.js", "Material UI", "Redux"],
  },
  {
    id: "4",
    title: "Kessoft Solutions",
    type: "Software Agency",
    slug: "kessoft-solutions",
    imageUrl: "/videos/kessoft.png",
    year: "2024",
    description:
      "A dynamic agency portfolio featuring 3D interactive elements and a modern, dark-themed aesthetic.",
    technologies: ["React", "Three.js", "Styled Components"],
  },
  {
    id: "5",
    title: "Beacon Energy",
    type: "Renewable Energy",
    slug: "beacon-energy",
    imageUrl: "/videos/beaconenergy.png",
    year: "2024",
    description:
      "An eco-conscious digital presence for a renewable energy provider, highlighting sustainability through organic design and smooth transitions.",
    technologies: ["Vue.js", "Nuxt", "SCSS"],
  },
];

export default WORKS;
