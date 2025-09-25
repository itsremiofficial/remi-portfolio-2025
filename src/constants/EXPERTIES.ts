import IconDesign from "../components/icons/Design";
import IconDevelopment from "../components/icons/Development";
import IconMarketing from "../components/icons/Marketing";
import type { IconProps } from "../components/icons/Instagram";
import type { FC } from "react";

interface ExpertiseItem {
  title: string;
  Icon?: FC<IconProps>;
  skills: { li: string }[];
}

export const EXPERTIES: ExpertiseItem[] = [
  {
    title: "Design",
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
    title: "Development",
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
    title: "Marketing",
    Icon: IconMarketing,
    skills: [
      { li: "Content Strategy" },
      { li: "Ad Campaign Management" },
      { li: "Campaign Analytics" },
      { li: "Community Engagement" },
      { li: "Brand Growth" },
    ],
  },
];
