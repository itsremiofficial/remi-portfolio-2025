import IconInstagram from "../components/icons/Instagram";
import IconBehance from "../components/icons/Behance";
import IconLinkedIn from "../components/icons/Linkedin";

export interface SocialPlatform {
  social: string;
  href: string;
  icon: React.ComponentType<{ className?: string; fill?: boolean }>;
}

// Static array: no need for useMemo since it's not dynamic
export const socialPlatforms: SocialPlatform[] = [
  {
    social: "Instagram",
    href: "https://www.instagram.com/itsremiofficial/",
    icon: IconInstagram,
  },
  {
    social: "Behance",
    href: "https://behance.com",
    icon: IconBehance,
  },
  {
    social: "LinkedIn",
    href: "https://www.linkedin.com/in/itsremiofficial/",
    icon: IconLinkedIn,
  },
];

export default socialPlatforms;
