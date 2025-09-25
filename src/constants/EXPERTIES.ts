import type { ComponentType } from "react";
import IconDesign from "../components/icons/Design";
import IconDevelopment from "../components/icons/Development";

// Define a type where icon is a component (reference), not JSX.
type IconComponent = ComponentType<{ className?: string }>;
interface ExpertiseItem {
  title: string;
  Icon?: IconComponent;
  skills: { li: string }[];
}

export const EXPERTIES: ExpertiseItem[] = [
  {
    title: "Visual Design",
    Icon: IconDesign,
    skills: [
      { li: "Brand & Identity" },
      { li: "Marketing & Advertising" },
      { li: "Web & UI/UX" },
      { li: "Product & Packaging" },
      { li: "Motion & Multimedia" },
    ],
  },
  {
    title: "Web Development",
    Icon: IconDevelopment,
    skills: [
      { li: "JavaScript / TypeScript" },
      { li: "React & Next.js" },
      { li: "Node.js & Express" },
      { li: "Prisma & Databases" },
      { li: "REST & GraphQL APIs" },
    ],
  },
  {
    title: "Digital Marketing",
    Icon: IconDesign,
    skills: [
      { li: "Content Strategy" },
      { li: "Ad Campaign Management" },
      { li: "Campaign Analytics" },
      { li: "Community Engagement" },
      { li: "Brand Growth" },
    ],
  },
];
