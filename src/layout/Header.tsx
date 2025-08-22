import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils";
import { useClickOutside } from "../hooks/outsideClick";
import AnimatedText from "../components/AnimatedText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useScrollTo } from "../hooks/useLenis";
import { CustomEase, MorphSVGPlugin } from "gsap/all";
import { useActiveSection } from "../hooks/useActiveSection";
import { useTheme } from "../hooks/useTheme";
import AnimatedTooltip from "../components/AnimatedTooltip";
import IconInstagram from "../components/icons/Instagram";
import TimeDisplay from "../components/DualTime";
import ThemeSwitcher from "../components/ThemeSwitcher";

gsap.registerPlugin(CustomEase, MorphSVGPlugin);

const MENU_ITEMS = [
  { text: "HOME", href: "#home" },
  { text: "WORK", href: "#work" },
  { text: "SERVICES", href: "#services" },
  { text: "CONTACT", href: "#contact" },
];

const Header = ({ fontsLoaded }: { fontsLoaded: boolean }) => {
  const { scrollToElement } = useScrollTo();
  const {
    colorScheme,
    themeMode,
    setColorScheme,
    toggleThemeMode,
    isTransitioning,
    isDark,
  } = useTheme();
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

  const headerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const navContainerBg = isDark ? "#0a0a09" : "#fff";
  // });

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY >= 100 && headerRef.current) {
  //       gsap.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.6 });
  //     } else if (headerRef.current) {
  //       gsap.to(headerRef.current, { autoAlpha: 0, y: 50, duration: 0.6 });
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useGSAP(() => {
    // Create a timeline for sequencing animations
    const tl = gsap.timeline();

    if (isExpanded) {
      // MENU CONTAINER START
      tl.to(menuContainerRef.current, {
        width: 420,
        height: 576,
        opacity: 1,
        backgroundColor: isDark ? "#000" : "#fff",
        duration: 0.8,
        ease: "0.7, 0, 0.2, 1",
      });
      tl.to(
        menuContainerRef.current,
        {
          borderRadius: 36,
          duration: 0.5,
          ease: "power1.in",
        },
        "<"
      );
      tl.to(
        ".menu_button",
        {
          padding: "24px 32px",
          duration: 0.4,
        },
        "<"
      );

      // MENU LINKS START
      tl.to(
        ".nav-links-container .link",
        {
          ease: "0.7, 0, 0.2, 1",
          opacity: 1,
          stagger: 0.1,
          rotationX: 0,
          z: 0,
        },
        "-=0.1"
      );

      // MENU HEADINGS START
      tl.to(
        ".nav-links-heading",
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "0.7, 0, 0.2, 1",
        },
        "-=0.7"
      );

      // MENU SOCIAL ICONS START
      tl.to(
        [".social_icon", ".theme_icon"],
        {
          opacity: 1,
          xPercent: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "0.7, 0, 0.2, 1",
        },
        "-=0.5"
      );
    } else {
      // MENU SOCIAL ICONS END
      tl.to(
        [".social_icon", ".theme_icon"],
        {
          opacity: 0,
          scale: 0.85,
          xPercent: -10,
          duration: 0.4,
          stagger: -0.2,
          ease: "0.8, 0, 0.3, 1",
        },
        "-=0.2"
      );

      // MENU HEADINGS END
      tl.to(
        ".nav-links-heading",
        {
          opacity: 0,
          y: -10,
          duration: 0.4,
          ease: "0.7, 0, 0.2, 1",
        },
        "-=0.3"
      );
      // MENU LINKS END
      tl.to(
        ".nav-links-container .link",
        {
          "will-change": "opacity, transform",
          transformOrigin: "50% 0%",
          opacity: 0,
          rotationX: -90,
          z: -200,
          stagger: 0.1,
          duration: 0.3,
          ease: "0.8, 0, 0.3, 1",
        },
        "-=0.3"
      );

      tl.to(
        ".menu_button",
        {
          padding: "14px 32px",
          duration: 0.4,
        },
        "<"
      );
      // MENU CONTAINER END
      tl.to(
        menuContainerRef.current,
        {
          width: 420,
          height: 64,
          borderRadius: 24,
          backgroundColor: isDark ? "#000" : "#fff",
          duration: 0.6,
          ease: "0.8, 0, 0.3, 1",
        },
        "<"
      );
    }
  }, [isExpanded, isDark]);

  return (
    <header ref={headerRef} className="sticky right-0 top-0 p-4 z-[99] h-24">
      <div className="flex items-center justify-between relative w-full h-full">
        <div className="flex items-center gap-3">
          <svg
            className="fill-foreground dark:fill-background w-14 h-14 grow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 19.96 20"
          >
            <path d="M10.64.26c0-.14.12-.26.26-.26h4.4c2.57,0,4.66,2.11,4.66,4.72s-2.09,4.72-4.66,4.72h-4.4c-.14,0-.26-.12-.26-.26,0,0,0-8.92,0-8.92Z" />
            <path d="M0,15.29c0-2.57,2.09-4.66,4.66-4.66h.06c2.61,0,4.72,2.09,4.72,4.66s-2.11,4.66-4.72,4.66h-.06c-2.57,0-4.66-2.09-4.66-4.66Z" />
            <path d="M19.56,19.56c.16.16.05.44-.18.44h-8.44c-.14,0-.26-.12-.26-.26v-8.43c0-.23.28-.35.44-.18,0,0,8.44,8.43,8.44,8.43Z" />
            <path d="M9.38,9.13c.03.16-.09.31-.25.31H2.1c-.12,0-.23-.09-.25-.21L.06.31c-.03-.16.09-.31.25-.31h7.02c.12,0,.23.09.25.21l1.78,8.92h.02Z" />
          </svg>
          <ThemeIcon />
        </div>
        <div
          ref={drawerRef}
          className={cn(
            "flex items-center justify-end group/button relative w-full h-full"
          )}
        >
          <div
            ref={menuContainerRef}
            className={cn(
              "absolute right-0 top-0 border w-[420px] h-16 rounded-4xl z-[100] overflow-hidden origin-top-right",
              "bg-nav-background dark:bg-nav-foreground",
              "border-black/20 dark:border-900/40"
            )}
          >
            <div
              className={cn(
                "menu_button flex justify-between items-center py-3.5"
              )}
            >
              <svg
                className="fill-foreground dark:fill-background w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 19.96 20"
              >
                <path d="M10.64.26c0-.14.12-.26.26-.26h4.4c2.57,0,4.66,2.11,4.66,4.72s-2.09,4.72-4.66,4.72h-4.4c-.14,0-.26-.12-.26-.26,0,0,0-8.92,0-8.92Z" />
                <path d="M0,15.29c0-2.57,2.09-4.66,4.66-4.66h.06c2.61,0,4.72,2.09,4.72,4.66s-2.11,4.66-4.72,4.66h-.06c-2.57,0-4.66-2.09-4.66-4.66Z" />
                <path d="M19.56,19.56c.16.16.05.44-.18.44h-8.44c-.14,0-.26-.12-.26-.26v-8.43c0-.23.28-.35.44-.18,0,0,8.44,8.43,8.44,8.43Z" />
                <path d="M9.38,9.13c.03.16-.09.31-.25.31H2.1c-.12,0-.23-.09-.25-.21L.06.31c-.03-.16.09-.31.25-.31h7.02c.12,0,.23.09.25.21l1.78,8.92h.02Z" />
              </svg>

              <div
                className={`nav-wrapper h-full w-full  ${
                  isExpanded ? "open" : " cursor-pointer"
                }`}
                onClick={toggleMenu}
              >
                <div className={cn("line-menu !w-1/2")}></div>
                <div className={cn("line-menu !w-full")}></div>
                <div className={cn("line-menu !w-1/2")}></div>
              </div>
            </div>

            <div className="nav-links-container flex flex-col gap-6 px-8">
              <div>
                <h4
                  className={cn(
                    "nav-links-heading select-none",
                    "font-nippo font-medium tracking-[3px]",
                    "text-foreground/30 dark:text-background/60",
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
                        "perspective-distant",
                        isActive
                          ? "text-foreground dark:text-100"
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
                          fontsLoaded={fontsLoaded}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <div className="space-y-3">
                  <h4
                    className={cn(
                      "nav-links-heading select-none",
                      "font-nippo font-medium tracking-[3px]",
                      "text-foreground/30 dark:text-background/60",
                      "sm:text-base text-xs"
                    )}
                  >
                    SOCIALS
                  </h4>
                  <div className="social_icons flex items-center gap-6 relative">
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
                      <a
                        key={index}
                        href={platform.href}
                        className="size-16 relative rounded-2xl social_icon"
                      >
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
                          Children={
                            <platform.icon className="size-full" fill />
                          }
                        />
                      </a>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4
                    className={cn(
                      "nav-links-heading select-none",
                      "font-nippo font-medium tracking-[3px]",
                      "text-foreground/30 dark:text-background/60",
                      "sm:text-base text-xs"
                    )}
                  >
                    THEME
                  </h4>
                  <div className="theme_icon">
                    <AnimatedTooltip
                      id={3}
                      className={cn(
                        "w-12 h-12 p-3 sm:w-16 sm:h-16 sm:p-4.5 mask mask-squircle !aspect-square",
                        "bg-black/15 hover:bg-black/20",
                        "text-black md:text-black hover:text-black",
                        "dark:bg-1000 dark:hover:bg-1100",
                        "dark:text-500 dark:hover:text-700",
                        "transition-colors duration-400 cursor-pointer"
                      )}
                      mains={isDark ? "Dark Mode" : "Light Mode"}
                      Children={<ThemeIcon className="size-full" />}
                    />
                  </div>
                </div>
              </div>
              {/* <ThemeSwitcher /> */}
            </div>
            <div className="flex items-end justify-between font-mono font-medium text-foreground/70 dark:text-background/50 mt-6 px-8 text-xs">
              <TimeDisplay
                timeType="time"
                className="nav-links-heading"
                mode="single"
                length="medium"
              />
              <div className="nav-links-heading">
                REMI &copy; {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

const ThemeIcon = ({ className }: { className?: string }) => {
  const { toggleThemeMode, isDark } = useTheme();
  const iconSun = useRef<SVGPathElement>(null);
  const iconMoon = useRef<SVGPathElement>(null);
  const iconStarSmall = useRef<SVGPathElement>(null);
  const iconStarLarge = useRef<SVGPathElement>(null);
  const sunRaysRef = useRef<SVGPathElement>(null);

  // Animate when theme changes
  useEffect(() => {
    if (iconSun.current && iconMoon.current) {
      const tlMoon = gsap.timeline();
      // MOON ICON ANIMATION
      tlMoon.to(iconMoon.current, {
        opacity: isDark ? 1 : 0,
        duration: 0.3,
        rotateZ: isDark ? 0 : 180,
      });

      tlMoon.to(iconStarSmall.current, {
        opacity: isDark ? 1 : 0,
        duration: 0.3,
        scale: isDark ? 1 : 0,
      });
      tlMoon.to(iconStarLarge.current, {
        opacity: isDark ? 1 : 0,
        duration: 0.3,
        scale: isDark ? 1 : 0,
      });

      // SUN ICON ANIMATION

      const tlSun = gsap.timeline();
      tlSun.to(iconSun.current, {
        opacity: isDark ? 0 : 1,
        duration: 0.3,
        rotateZ: isDark ? 180 : 0,
      });
      tlSun.to(sunRaysRef.current, {
        scale: isDark ? 0 : 1,
        opacity: isDark ? 0 : 0.8,
        transformOrigin: "center center",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    toggleThemeMode();
  };

  return (
    <>
      <svg
        className={cn("cursor-pointer text-black dark:text-white", className)}
        onClick={handleToggleTheme}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={iconSun} style={{ transformOrigin: "center center" }}>
          <path
            d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V4C12.75 4.41421 12.4142 4.75 12 4.75C11.5858 4.75 11.25 4.41421 11.25 4V2C11.25 1.58579 11.5858 1.25 12 1.25ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H4C4.41421 11.25 4.75 11.5858 4.75 12C4.75 12.4142 4.41421 12.75 4 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM19.25 12C19.25 11.5858 19.5858 11.25 20 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H20C19.5858 12.75 19.25 12.4142 19.25 12ZM12 19.25C12.4142 19.25 12.75 19.5858 12.75 20V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V20C11.25 19.5858 11.5858 19.25 12 19.25Z"
            fill="currentColor"
          />
          <g
            ref={sunRaysRef}
            opacity="0.5"
            style={{ transformOrigin: "center center" }}
          >
            <path
              d="M3.6687 3.7156C3.9482 3.4099 4.4226 3.38867 4.7283 3.66817L6.95032 5.69975C7.25602 5.97925 7.27726 6.45365 6.99776 6.75935C6.71826 7.06505 6.24386 7.08629 5.93816 6.80679L3.71614 4.7752C3.41044 4.4957 3.3892 4.0213 3.6687 3.7156Z"
              fill="currentColor"
            />
            <path
              d="M20.3314 3.7156C20.6109 4.0213 20.5897 4.4957 20.284 4.7752L18.062 6.80679C17.7563 7.08629 17.2819 7.06505 17.0024 6.75935C16.7229 6.45365 16.7441 5.97925 17.0498 5.69975L19.2718 3.66817C19.5775 3.38867 20.0519 3.4099 20.3314 3.7156Z"
              fill="currentColor"
            />
            <path
              d="M17.0256 17.0247C17.3185 16.7318 17.7934 16.7319 18.0862 17.0248L20.3082 19.2471C20.6011 19.54 20.6011 20.0148 20.3082 20.3077C20.0153 20.6006 19.5404 20.6006 19.2475 20.3076L17.0255 18.0854C16.7326 17.7924 16.7327 17.3176 17.0256 17.0247Z"
              fill="currentColor"
            />
            <path
              d="M6.97472 17.0249C7.26761 17.3177 7.26761 17.7926 6.97472 18.0855L4.7525 20.3077C4.4596 20.6006 3.98473 20.6006 3.69184 20.3077C3.39894 20.0148 3.39894 19.54 3.69184 19.2471L5.91406 17.0248C6.20695 16.732 6.68183 16.732 6.97472 17.0249Z"
              fill="currentColor"
            />
          </g>
        </g>

        <g ref={iconMoon} style={{ transformOrigin: "center center" }}>
          <path
            ref={iconStarLarge}
            d="M19.9001 2.30719C19.7392 1.8976 19.1616 1.8976 19.0007 2.30719L18.5703 3.40247C18.5212 3.52752 18.4226 3.62651 18.298 3.67583L17.2067 4.1078C16.7986 4.26934 16.7986 4.849 17.2067 5.01054L18.298 5.44252C18.4226 5.49184 18.5212 5.59082 18.5703 5.71587L19.0007 6.81115C19.1616 7.22074 19.7392 7.22074 19.9001 6.81116L20.3305 5.71587C20.3796 5.59082 20.4782 5.49184 20.6028 5.44252L21.6941 5.01054C22.1022 4.849 22.1022 4.26934 21.6941 4.1078L20.6028 3.67583C20.4782 3.62651 20.3796 3.52752 20.3305 3.40247L19.9001 2.30719Z"
            fill="currentColor"
          />
          <path
            ref={iconStarSmall}
            d="M16.0328 8.12967C15.8718 7.72009 15.2943 7.72009 15.1333 8.12967L14.9764 8.52902C14.9273 8.65407 14.8287 8.75305 14.7041 8.80237L14.3062 8.95987C13.8981 9.12141 13.8981 9.70107 14.3062 9.86261L14.7041 10.0201C14.8287 10.0694 14.9273 10.1684 14.9764 10.2935L15.1333 10.6928C15.2943 11.1024 15.8718 11.1024 16.0328 10.6928L16.1897 10.2935C16.2388 10.1684 16.3374 10.0694 16.462 10.0201L16.8599 9.86261C17.268 9.70107 17.268 9.12141 16.8599 8.95987L16.462 8.80237C16.3374 8.75305 16.2388 8.65407 16.1897 8.52902L16.0328 8.12967Z"
            fill="currentColor"
          />
          <path
            opacity={0.5}
            d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </>
  );
};
