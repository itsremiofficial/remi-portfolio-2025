import IconDesign from "../components/icons/Design";
import IconDevelopment from "../components/icons/Development";
import IconMarketing from "../components/icons/Marketing";
import type { IconProps } from "../components/icons/Instagram";
import type { FC } from "react";
import DesignIllustration from "../components/ui/DesignIllustration";

interface ExpertiseItem {
  title: string;
  subtitle?: string;
  illustration?: FC<IllustrationProps>;
  Icon?: FC<IconProps>;
  skills: { li: string }[];
}

export const EXPERTIES: ExpertiseItem[] = [
  {
    title: "Design",
    subtitle: "Visual",
    Icon: IconDesign,
    illustration: DesignIllustration,
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
    subtitle: "Web",
    Icon: IconDevelopment,
    illustration: DesignIllustration,
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
    subtitle: "Digital",
    Icon: IconMarketing,
    illustration: DesignIllustration,
    skills: [
      { li: "Content Strategy" },
      { li: "Ad Campaign Management" },
      { li: "Campaign Analytics" },
      { li: "Community Engagement" },
      { li: "Brand Growth" },
    ],
  },
];
