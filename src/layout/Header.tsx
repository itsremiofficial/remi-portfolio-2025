import { useCallback, useRef, useState } from "react";
import { cn } from "../utils";
import { useClickOutside } from "../hooks/outsideClick";
import AnimatedText from "../components/AnimatedText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useScrollTo } from "../hooks/useLenis";
import { CustomEase } from "gsap/all";
import { useActiveSection } from "../hooks/useActiveSection";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useTheme } from "../hooks/useTheme";
import AnimatedTooltip from "../components/AnimatedTooltip";
import IconInstagram from "../components/icons/Instagram";

gsap.registerPlugin(CustomEase);

const MENU_ITEMS = [
  { text: "HOME", href: "#home" },
  { text: "WORK", href: "#work" },
  { text: "SERVICES", href: "#services" },
  { text: "CONTACT", href: "#contact" },
];

const Header = () => {
  const { scrollToElement } = useScrollTo();
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const ease = CustomEase.create("custom", "0.7, 0, 0.2, 1");

  // Track active section
  const sectionIds = MENU_ITEMS.map((item) => item.href.replace("#", ""));
  const activeSection = useActiveSection(sectionIds);

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
        backgroundColor: isDark ? "#0a0a09" : "#fff",
        duration: 0.8,
        ease: "powerin.out",
      });

      // Then animate the menu items
      tl.to(
        ".nav-links-container .link",
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.3,
          ease: "0.7, 0, 0.2, 1",
        },
        "-=0.2" // Slight overlap for smoother transition
      );
    } else {
      // Collapse animation - reverse order
      tl.to(".nav-links-container .link", {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: "0.8, 0, 0.3, 1",
      });

      tl.to(
        menuContainerRef.current,
        {
          width: 96,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#fff",
          duration: 0.6,
          ease: "0.8, 0, 0.3, 1",
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
          className={cn(
            "absolute top-0 right-0 p-5 border w-24 h-16 rounded-4xl z-[-1] overflow-hidden origin-top-right",
            "border-black/20 bg-white",
            "dark:border-900/40 dark:bg-dark"
          )}
        >
          <div className={cn("menu_button justify-self-center")}>
            <div
              className={`nav-wrapper h-full w-full  ${
                isExpanded ? "open" : ""
              }`}
              onClick={toggleMenu}
            >
              <div className="line-menu !w-1/2"></div>
              <div className="line-menu !w-full"></div>
              <div className="line-menu !w-1/2"></div>
            </div>
          </div>

          <div className="nav-links-container flex flex-col h-full justify-between gap-2 py-10 px-4">
            <div>
              <h4
                className={cn(
                  "select-none",
                  "font-nippo font-medium tracking-[3px]",
                  "dark:text-white text-black/30",
                  "sm:text-base text-xs"
                )}
              >
                MENU
              </h4>
              {MENU_ITEMS.map((item, index) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <div
                    className={cn(
                      "link flex items-center gap-3 text-7xl font-extrabold opacity-0 cursor-pointer font-robo !font-var group/link transition-colors duration-400",
                      isActive
                        ? "text-accent dark:text-100"
                        : "text-black/30 hover:text-black dark:hover:text-100 dark:text-1100"
                    )}
                    key={item.href}
                    onClick={() => {
                      const elementId = item.href.replace("#", "");
                      scrollToElement(elementId, {
                        offset: -100,
                        duration: 2.5,
                        easing: (t: number): number => ease(t),
                      });
                      setIsExpanded(false);
                    }}
                  >
                    <div>{index + 1}.</div>
                    <div className="leading-0 cursor-pointer overflow-hidden">
                      <AnimatedText
                        linkText1={item.text}
                        linkText2={item.text}
                        className={cn("link_text tracking-normal leading-0")}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              <h4
                className={cn(
                  "select-none",
                  "font-nippo font-medium tracking-[3px]",
                  "dark:text-white text-black/30",
                  "sm:text-base text-xs"
                )}
              >
                SOCIALS
              </h4>
              <div className="social_icons flex items-center gap-6">
                {[
                  {
                    social: "Instagram",
                    href: "https://fronus.com",
                    icon: IconInstagram,
                  },
                  {
                    social: "Linked In",
                    href: "https://discord.com",
                    icon: IconInstagram,
                  },
                ].map((platform, index) => (
                  <a key={index} href={platform.href} className="size-16">
                    <AnimatedTooltip
                      id={index + 1}
                      className={cn(
                        "w-12 h-12 p-3 sm:w-16 sm:h-16 sm:p-4.5 mask mask-squircle !aspect-square",
                        "bg-black/15 hover:bg-black/20",
                        "text-black md:text-black hover:text-black",
                        "dark:bg-1000 dark:hover:bg-1100",
                        "dark:text-500 dark:hover:text-700",
                        "transition-colors duration-400"
                      )}
                      mains={platform.social}
                      Children={<platform.icon className="size-full" fill />}
                    />
                  </a>
                ))}
              </div>
            </div>
            {/* <ThemeSwitcher /> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
