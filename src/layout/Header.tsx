import { useCallback, useRef, useState } from "react";
import MagneticButton from "../components/MagneticButton";
import { cn } from "../utils";
import { useClickOutside } from "../hooks/outsideClick";
import AnimatedText from "../components/AnimatedText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MENU_ITEMS = [
  { text: "HOME", href: "#home" },
  { text: "WORK", href: "#work" },
  { text: "SERVICES", href: "#services" },
  { text: "CONTACT", href: "#contact" },
];

interface SiteHeaderProps {
  handleScroll: (sectionId: string) => void;
}

const Header: React.FC<SiteHeaderProps> = ({ handleScroll }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);
  useClickOutside(drawerRef, () => {
    if (isExpanded) toggleMenu();
  });

  useGSAP(() => {
    // Create a timeline for sequencing animations
    const tl = gsap.timeline();

    if (isExpanded) {
      // First animate the container
      tl.to(menuContainerRef.current, {
        width: 420,
        height: 576,
        opacity: 1,
        borderRadius: 36,
        backgroundColor: "white",
        duration: 0.8,
        ease: "0.7, 0, 0.2, 1",
      });

      // Then animate the menu items
      tl.to(
        ".menu_links_container .link",
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "0.7, 0, 0.2, 1",
        },
        "-=0.2" // Slight overlap for smoother transition
      );
    } else {
      // Collapse animation - reverse order
      tl.to(".menu_links_container .link", {
        y: -30,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: "0.7, 0, 0.2, 1",
      });

      tl.to(
        menuContainerRef.current,
        {
          width: 96,
          height: 64,
          borderRadius: 32,
          backgroundColor: "transparent",
          duration: 0.6,
          ease: "0.7, 0, 0.2, 1",
        },
        "-=0.1"
      );
    }
  }, [isExpanded]);

  return (
    <header className="sticky top-0 left-0 right-0 p-4 z-[99] h-24">
      <div></div>
      <div
        ref={drawerRef}
        className={cn("flex items-center justify-center group/button relative")}
      >
        <div
          ref={menuContainerRef}
          className="absolute top-0 right-0 p-5 border-900/40 border bg-primary w-24 h-16 rounded-4xl z-[-1] overflow-hidden origin-top-right"
        >
          <div className={cn("menu_button justify-self-center")}>
            <div
              className={`wrapper-menu h-full w-full  ${
                isExpanded ? "open" : ""
              }`}
              onClick={toggleMenu}
            >
              <div className="line-menu h-1 !w-1/2 start"></div>
              <div className="line-menu h-1 !w-full center"></div>
              <div className="line-menu h-1 !w-1/2 end"></div>
            </div>
          </div>

          <div className="menu_links_container flex flex-col gap-2 pt-10 px-4">
            {MENU_ITEMS.map((item, index) => {
              return (
                <div
                  className="link flex items-center gap-3 text-7xl font-extrabold opacity-0 cursor-pointer font-robo font-var"
                  key={item.href}
                >
                  <div className={cn("text-light")}>{index + 1}.</div>
                  <div
                    className="leading-0 cursor-pointer"
                    onClick={() => handleScroll(item.href)}
                  >
                    <AnimatedText
                      linkText1={item.text}
                      linkText2={item.text}
                      className={cn(
                        "link_text tracking-normal leading-0 text-light"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
