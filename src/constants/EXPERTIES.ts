import IconDesign from "../components/icons/Design";
import IconDevelopment from "../components/icons/Development";
import IconMarketing from "../components/icons/Marketing";
import type { IconProps } from "../components/icons/Instagram";
import type { FC } from "react";
import DesignIllustration from "../components/illustrations/DesignIllustration";
import DevIllustration from "../components/illustrations/DevIllustrations";
import MarketingIllustration from "../components/illustrations/MarketingIllustration";
import IconStarish from "../components/icons/Starish";

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
    illustration: DevIllustration,
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
    illustration: MarketingIllustration,
    skills: [
      { li: "Content Strategy" },
      { li: "Ad Campaign Management" },
      { li: "Campaign Analytics" },
      { li: "Community Engagement" },
      { li: "Brand Growth" },
    ],
  },
];

export const SERVICES_MARQUEE = [
  {
    icon: IconStarish,
    title: "VISUAL DESIGN",
    subtitle: "turning imagination into visuals",
  },
  {
    icon: IconStarish,
    title: "WEB DEVELOPMENT",
    subtitle: "Shaping experience with code",
  },
  {
    icon: IconStarish,
    title: "DIGITAL MARKETING",
    subtitle: "making people feel your brand",
  },
];
