/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
  useLayoutEffect, // added
} from "react";
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
import IconLinkedIn from "../components/icons/Linkedin";
import { MENU_ITEMS } from "../constants/HERO";

gsap.registerPlugin(CustomEase, MorphSVGPlugin);

const CUSTOM_EASE = "0.7, 0, 0.2, 1";
const ANIMATION_EASE_IN = "0.8, 0, 0.3, 1";
// Change the Logo component to properly handle the ref type
const Logo = memo(
  React.forwardRef<SVGSVGElement>((props, ref) => (
    <svg
      ref={ref}
      className="text-foreground dark:text-background h-7"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 103 20"
    >
      <path
        id="r_letter"
        fill="currentColor"
        d="M40.63,19.85c.05.09.14.15.24.15h5.33c.21,0,.35-.23.24-.41l-3.43-6.14c-.07-.13-.03-.29.09-.37,1.68-1.2,2.78-3.13,2.78-5.67s-.74-4.29-2.2-5.55C42.23.61,40.11,0,37.46,0h-10.53C26.78,0,26.65.12,26.65.28v19.44c0,.15.12.28.28.28h5.37c.15,0,.28-.12.28-.28v-4.92c0-.15.12-.28.28-.28h4.72c.1,0,.2.06.24.15l2.8,5.19h0ZM32.59,5.33c0-.15.12-.28.28-.28h4.28c.99,0,1.69.23,2.14.62.44.38.69.96.69,1.78s-.25,1.4-.69,1.78c-.45.39-1.15.62-2.14.62h-4.28c-.15,0-.28-.12-.28-.28v-4.25h0Z"
      />
      <path
        id="e_letter"
        fill="currentColor"
        d="M49.58,0c-.15,0-.28.12-.28.28v19.44c0,.15.12.28.28.28h16.79c.15,0,.28-.12.28-.28v-4.38c0-.15-.12-.28-.28-.28h-10.87c-.15,0-.28-.12-.28-.28v-2.35c0-.15.12-.28.28-.28h10.45c.15,0,.28-.12.28-.28v-3.79c0-.15-.12-.28-.28-.28h-10.45c-.15,0-.28-.12-.28-.28v-2.32c0-.15.12-.28.28-.28h10.87c.15,0,.28-.12.28-.28V.28c0-.15-.12-.28-.28-.28h-16.79Z"
      />
      <path
        id="m_letter"
        fill="currentColor"
        d="M70.76,0c-.15,0-.28.12-.28.28v19.44c0,.15.12.28.28.28h5.14c.15,0,.28-.12.28-.28v-8.04c0-.31.44-.39.54-.09l2.82,8.22c.04.11.14.19.26.19h4.1c.12,0,.22-.08.26-.19l2.82-8.22c.1-.3.54-.22.54.09v8.04c0,.15.12.28.28.28h5.14c.15,0,.28-.12.28-.28V.28c0-.15-.12-.28-.28-.28h-6.74c-.12,0-.23.08-.26.19l-3.82,11.46c-.08.25-.44.25-.53,0L77.77.19c-.04-.11-.14-.19-.26-.19h-6.75Z"
      />
      <path
        id="i_letter"
        fill="currentColor"
        d="M97.35,0c-.15,0-.28.12-.28.28v19.44c0,.15.12.28.28.28h5.37c.15,0,.28-.12.28-.28V.28c0-.15-.12-.28-.28-.28h-5.37Z"
      />
      <path
        id="half-rounded-square"
        fill="currentColor"
        d="M10.64.26c0-.14.12-.26.26-.26h4.4c2.57,0,4.66,2.11,4.66,4.72s-2.09,4.72-4.66,4.72h-4.4c-.14,0-.26-.12-.26-.26,0,0,0-8.92,0-8.92Z"
      />
      <path
        id="full-rounded-square"
        fill="currentColor"
        d="M0,15.29c0-2.57,2.09-4.66,4.66-4.66h.06c2.61,0,4.72,2.09,4.72,4.66s-2.11,4.66-4.72,4.66h-.06c-2.57,0-4.66-2.09-4.66-4.66Z"
      />
      <path
        id="triangle"
        fill="currentColor"
        d="M19.56,19.56c.16.16.05.44-.18.44h-8.44c-.14,0-.26-.12-.26-.26v-8.43c0-.23.28-.35.44-.18,0,0,8.44,8.43,8.44,8.43Z"
      />
      <path
        id="parallelogram"
        fill="currentColor"
        d="M9.38,9.13c.03.16-.09.31-.25.31H2.1c-.12,0-.23-.09-.25-.21L.06.31c-.03-.16.09-.31.25-.31h7.02c.12,0,.23.09.25.21l1.78,8.92h.02Z"
      />
    </svg>
  ))
);
// Memoize Nav Menu items to prevent unnecessary re-renders
const NavItem = memo(
  ({
    item,
    index,
    isActive,
    onClick,
    fontsLoaded,
  }: {
    item: { text: string; href: string };
    index: number;
    isActive: boolean;
    onClick: () => void;
    fontsLoaded: boolean;
  }) => (
    <div
      className={cn(
        "link flex items-center gap-3 text-7xl font-extrabold opacity-0 cursor-pointer font-robo !font-var group/link transition-colors duration-400",
        "perspective-distant will-change-transform",
        isActive
          ? "text-foreground dark:text-100"
          : "text-black/30 hover:text-black dark:hover:text-100 dark:text-background/30"
      )}
      onClick={onClick}
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
  )
);

// Memoize Social Icon component
const SocialIcon = memo(
  ({
    platform,
    index,
  }: {
    platform: { social: string; href: string; icon: any };
    index: number;
  }) => (
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
          "dark:bg-foreground dark:hover:bg-1100",
          "dark:text-500 dark:hover:text-700",
          "transition-colors duration-400"
        )}
        mains={platform.social}
        Children={<platform.icon className="size-full" fill />}
      />
    </a>
  )
);

const Header = ({ fontsLoaded }: { fontsLoaded: boolean }) => {
  const { scrollToElement } = useScrollTo();
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  // const scrollTimerRef = useRef<number | null>(null);
  const morphTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Create custom ease once
  const ease = useMemo(() => CustomEase.create("custom", CUSTOM_EASE), []);

  // Track active section
  const sectionIds = useMemo(
    () => MENU_ITEMS.map((item) => item.href.replace("#", "")),
    []
  );
  const activeSection = useActiveSection(sectionIds);

  const toggleMenu = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  useClickOutside(drawerRef, () => {
    if (isExpanded) toggleMenu();
  });
  // In your Header component, replace the existing scroll effect with this:

  // Optimized scroll handler with immediate initial state application
  useLayoutEffect(() => {
    let lastKnownScrollY = 0;
    let ticking = false;
    let animationState: "small" | "full" =
      window.scrollY >= 150 ? "small" : "full";

    // Apply initial state instantly (no animation flash)
    const applyImmediateState = (state: "small" | "full") => {
      if (!menuContainerRef.current) return;
      if (state === "small") {
        gsap.set(menuContainerRef.current, { width: 420 });
        gsap.set("#r_letter", { morphSVG: "#full-rounded-square" });
        gsap.set("#e_letter", { morphSVG: "#triangle" });
        gsap.set("#m_letter", { morphSVG: "#parallelogram" });
        gsap.set("#i_letter", { morphSVG: "#half-rounded-square" });
      } else {
        gsap.set(menuContainerRef.current, { width: "100%" });
        gsap.set("#r_letter", { morphSVG: "#r_letter" });
        gsap.set("#e_letter", { morphSVG: "#e_letter" });
        gsap.set("#m_letter", { morphSVG: "#m_letter" });
        gsap.set("#i_letter", { morphSVG: "#i_letter" });
      }
    };

    applyImmediateState(animationState);

    const handleScroll = () => {
      lastKnownScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newState: "small" | "full" =
            lastKnownScrollY >= 150 ? "small" : "full";
          if (newState !== animationState) {
            animationState = newState;
            if (morphTimelineRef.current) morphTimelineRef.current.kill();
            const morphTl = gsap.timeline();
            morphTimelineRef.current = morphTl;

            if (animationState === "small" && menuContainerRef.current) {
              morphTl
                .to(menuContainerRef.current, {
                  width: 420,
                  duration: 1,
                  ease: "power3.out",
                })
                .to(
                  "#r_letter",
                  {
                    morphSVG: "#full-rounded-square",
                    duration: 1.5,
                    ease: "power2.out",
                  },
                  "<"
                )
                .to(
                  "#e_letter",
                  { morphSVG: "#triangle", duration: 1.5, ease: "power2.out" },
                  "<0.05"
                )
                .to(
                  "#m_letter",
                  {
                    morphSVG: "#parallelogram",
                    duration: 1.5,
                    ease: "power2.out",
                  },
                  "<0.05"
                )
                .to(
                  "#i_letter",
                  {
                    morphSVG: "#half-rounded-square",
                    duration: 1.5,
                    ease: "power2.out",
                  },
                  "<0.05"
                );
            } else if (menuContainerRef.current) {
              morphTl
                .to(menuContainerRef.current, {
                  width: "100%",
                  duration: 1,
                  ease: "power3.out",
                })
                .to(
                  "#r_letter",
                  { morphSVG: "#r_letter", duration: 1.5, ease: "power2.out" },
                  "<"
                )
                .to(
                  "#e_letter",
                  { morphSVG: "#e_letter", duration: 1.5, ease: "power2.out" },
                  "<0.05"
                )
                .to(
                  "#m_letter",
                  { morphSVG: "#m_letter", duration: 1.5, ease: "power2.out" },
                  "<0.05"
                )
                .to(
                  "#i_letter",
                  { morphSVG: "#i_letter", duration: 1.5, ease: "power2.out" },
                  "<0.05"
                );
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      morphTimelineRef.current?.kill();
    };
  }, []);

  // Menu animation with performance optimization
  useGSAP(() => {
    // Use a single timeline for all animations
    const tl = gsap.timeline({
      paused: true,
      immediateRender: false, // Improve initial render performance
    });

    if (isExpanded) {
      tl.addLabel("start")
        // Menu container expansion
        .to(menuContainerRef.current, {
          height: 640,
          opacity: 1,
          backgroundColor: isDark ? "#0000009a" : "#ffffff8a",
          duration: 0.8,
          ease: CUSTOM_EASE,
          force3D: true,
        })
        .to(
          menuContainerRef.current,
          {
            borderRadius: 36,
            duration: 0.5,
            ease: "power1.in",
          },
          "<"
        )
        .to(
          ".menu_button",
          {
            padding: "24px 32px",
            duration: 0.4,
          },
          "<"
        )
        // Menu links fade in
        .to(
          ".nav-links-container .link",
          {
            ease: CUSTOM_EASE,
            opacity: 1,
            stagger: 0.1,
            rotationX: 0,
            z: 0,
            force3D: true, // Force GPU acceleration
          },
          "-=0.1"
        )
        // Menu headings fade in
        .to(
          ".nav-links-heading",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: CUSTOM_EASE,
          },
          "-=0.7"
        )
        // Social icons fade in
        .to(
          [".social_icon", ".theme_icon"],
          {
            opacity: 1,
            xPercent: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: CUSTOM_EASE,
          },
          "-=0.5"
        );
    } else {
      tl.addLabel("start")
        // Fade out social icons
        .to(
          [".social_icon", ".theme_icon"],
          {
            opacity: 0,
            scale: 0.85,
            xPercent: -10,
            duration: 0.4,
            stagger: -0.2,
            ease: ANIMATION_EASE_IN,
          },
          "start"
        )
        // Fade out headings
        .to(
          ".nav-links-heading",
          {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: CUSTOM_EASE,
          },
          "-=0.3"
        )
        // Fade out links
        .to(
          ".nav-links-container .link",
          {
            willChange: "opacity, transform",
            transformOrigin: "50% 0%",
            opacity: 0,
            rotationX: -90,
            z: -200,
            stagger: 0.1,
            duration: 0.3,
            ease: ANIMATION_EASE_IN,
            force3D: true, // Force GPU acceleration
          },
          "-=0.3"
        )
        // Menu button animation
        .to(
          ".menu_button",
          {
            padding: "17.20px 32px",
            duration: 0.4,
          },
          "<"
        )
        // Menu container collapse
        .to(
          menuContainerRef.current,
          {
            height: 64,
            borderRadius: 20,
            backgroundColor: isDark ? "#0000009a" : "#ffffff8a",
            duration: 0.6,
            ease: ANIMATION_EASE_IN,
            force3D: true, // Force GPU acceleration
          },
          "<"
        );
    }

    // Play the timeline
    tl.play();

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [isExpanded, isDark]);

  // Memoize scroll handler for menu items
  const handleNavItemClick = useCallback(
    (elementId: string) => {
      scrollToElement(elementId, {
        offset: -100,
        duration: 2.5,
        easing: (t: number): number => ease(t),
      });
      setIsExpanded(false);
    },
    [scrollToElement, ease]
  );

  // Memoize social platform data
  const socialPlatforms = useMemo(
    () => [
      {
        social: "Instagram",
        href: "https://fronus.com",
        icon: IconInstagram,
      },
      {
        social: "Linked In",
        href: "https://discord.com",
        icon: IconLinkedIn,
      },
    ],
    []
  );

  return (
    <header ref={headerRef} className="sticky right-0 top-0 p-4 z-[99] h-24">
      <div
        ref={drawerRef}
        className="flex items-center justify-center group/button relative w-full h-full"
      >
        <div
          ref={menuContainerRef}
          className={cn(
            "absolute top-0 border w-full h-16 rounded-2xl z-[100] overflow-hidden origin-top-right space-y-3 backdrop-blur-2xl",
            "bg-nav-background/10 dark:bg-nav-foreground/70",
            "border-black/10 dark:border-background/12",
            "will-change-[width,height,borderRadius]" // Optimize property animations
          )}
        >
          <div className="menu_button flex justify-between items-center py-[17.20px] px-8 !m-0 will-change-[padding]">
            <Logo ref={logoRef} />

            <div
              className={`nav-wrapper h-full w-full ${
                isExpanded ? "open" : ""
              }`}
              onClick={toggleMenu}
            >
              <div className="line-menu !w-1/2"></div>
              <div className="line-menu !w-full"></div>
              <div className="line-menu !w-1/2"></div>
            </div>
          </div>
          <div className="space-y-8 px-8">
            <div className="nav-links-container flex flex-col gap-2">
              <h4
                className={cn(
                  "nav-links-heading select-none",
                  "font-nippo font-medium tracking-[3px]",
                  "text-foreground/30 dark:text-background/40",
                  "sm:text-base text-xs",
                  "will-change-[opacity,transform]" // Optimize property animations
                )}
              >
                MENU
              </h4>
              {MENU_ITEMS.map((item, index) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <NavItem
                    key={item.href}
                    item={item}
                    index={index}
                    isActive={isActive}
                    onClick={() =>
                      handleNavItemClick(item.href.replace("#", ""))
                    }
                    fontsLoaded={fontsLoaded}
                  />
                );
              })}
            </div>
            <div className="flex gap-20">
              <div className="space-y-3">
                <h4
                  className={cn(
                    "nav-links-heading select-none",
                    "font-nippo font-medium tracking-[3px]",
                    "text-foreground/30 dark:text-background/40",
                    "sm:text-base text-xs",
                    "will-change-[opacity,transform]" // Optimize property animations
                  )}
                >
                  SOCIALS
                </h4>
                <div className="social_icons flex items-center gap-6 relative">
                  {socialPlatforms.map((platform, index) => (
                    <SocialIcon
                      key={platform.social}
                      platform={platform}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4
                  className={cn(
                    "nav-links-heading select-none",
                    "font-nippo font-medium tracking-[3px]",
                    "text-foreground/30 dark:text-background/40",
                    "sm:text-base text-xs",
                    "will-change-[opacity,transform]" // Optimize property animations
                  )}
                >
                  THEME
                </h4>
                <div className="theme_icon will-change-[opacity,transform]">
                  <AnimatedTooltip
                    id={3}
                    className={cn(
                      "w-12 h-12 p-3 sm:w-16 sm:h-16 sm:p-4.5 mask mask-squircle !aspect-square",
                      "bg-black/15 hover:bg-black/20",
                      "text-black md:text-black hover:text-black",
                      "dark:bg-foreground dark:hover:bg-1100",
                      "dark:text-500 dark:hover:text-700",
                      "transition-colors duration-400 cursor-pointer"
                    )}
                    mains={isDark ? "Dark Mode" : "Light Mode"}
                    Children={<ThemeIcon className="size-full" />}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between font-mono font-medium text-foreground/70 dark:text-background/50 text-xs pt-4">
              <TimeDisplay
                timeType="time"
                className="nav-links-heading"
                mode="single"
                length="medium"
              />
              <div className="nav-links-heading">Version 1.13</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);

// Memoize ThemeIcon for better performance
const ThemeIcon = memo(({ className }: { className?: string }) => {
  const { toggleThemeMode, isDark } = useTheme();
  const iconSun = useRef<SVGPathElement>(null);
  const iconSunInner = useRef<SVGPathElement>(null);
  const iconMoon = useRef<SVGPathElement>(null);
  const starsContainerRef = useRef<SVGGElement>(null);
  const iconStarLarge = useRef<SVGPathElement>(null);
  const sunRaysRef = useRef<SVGGElement>(null);
  const animationTimelineRef = useRef<{
    moon: gsap.core.Timeline | null;
    sun: gsap.core.Timeline | null;
  }>({
    moon: null,
    sun: null,
  });

  // Optimize theme change animation
  useEffect(() => {
    if (!(iconSun.current && iconMoon.current)) return;

    // Kill any existing animations to prevent conflicts
    if (animationTimelineRef.current.moon)
      animationTimelineRef.current.moon.kill();
    if (animationTimelineRef.current.sun)
      animationTimelineRef.current.sun.kill();

    // Create new timelines
    const tlMoon = gsap.timeline({
      defaults: {
        ease: "power2.inOut",
        force3D: true, // Force GPU acceleration
      },
    });

    const tlSun = gsap.timeline({
      defaults: {
        ease: "power2.inOut",
        force3D: true, // Force GPU acceleration
      },
    });

    animationTimelineRef.current.moon = tlMoon;
    animationTimelineRef.current.sun = tlSun;

    // Moon animation
    tlMoon.to(iconMoon.current, {
      opacity: isDark ? 1 : 0,
      duration: 0.3,
      rotateZ: isDark ? 0 : 180,
    });

    // Stars animation
    if (starsContainerRef.current) {
      const smallStars = starsContainerRef.current.querySelectorAll("circle");
      tlMoon.to(
        smallStars,
        {
          opacity: isDark ? 1 : 0,
          duration: 0.3,
          scale: isDark ? 1 : 0,
          stagger: 0.08, // Slightly faster for better performance
          transformOrigin: "center center",
        },
        "<0.1"
      );
    }

    tlMoon.to(
      iconStarLarge.current,
      {
        opacity: isDark ? 1 : 0,
        duration: 0.3,
        scale: isDark ? 1 : 0,
        transformOrigin: "center center",
      },
      "<0.05"
    );

    // Sun animation
    tlSun.to(
      iconSun.current,
      {
        opacity: isDark ? 0 : 1,
        duration: 0.3,
        rotateZ: isDark ? -180 : 0,
      },
      "<"
    );

    // Sun rays animation
    if (sunRaysRef.current) {
      const rays = sunRaysRef.current.querySelectorAll("path");
      tlSun.to(
        rays,
        {
          scale: isDark ? 0 : 1,
          rotateZ: isDark ? 90 : 0,
          opacity: isDark ? 0 : 0.7,
          transformOrigin: "center center",
          duration: 0.4,
          stagger: 0.04, // Slightly faster for better performance
        },
        "<0.1"
      );
    }

    // Cleanup function not needed as we handle timeline kills on next effect run
  }, [isDark]);

  return (
    <svg
      className={cn("cursor-pointer text-black dark:text-white", className)}
      onClick={toggleThemeMode}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ICON SUN */}
      <g ref={iconSun} style={{ transformOrigin: "center center" }}>
        <g ref={sunRaysRef} className="sun-rays" opacity={0.5}>
          <path
            fill="currentColor"
            d="M7.42,7.42c-.59.59-1.53.59-2.12,0l-1.58-1.58c-.59-.59-.59-1.53,0-2.12s1.53-.59,2.12,0l1.58,1.58c.59.59.59,1.53,0,2.12Z"
          />
          <path
            fill="currentColor"
            d="M5.52,12c0,.83-.67,1.5-1.5,1.5H1.79c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5h2.23c.83,0,1.5.67,1.5,1.5Z"
          />
          <path
            fill="currentColor"
            d="M7.42,16.58c.59.59.59,1.53,0,2.12l-1.58,1.58c-.59.59-1.53.59-2.12,0s-.59-1.53,0-2.12l1.58-1.58c.59-.59,1.53-.59,2.12,0Z"
          />
          <path
            fill="currentColor"
            d="M12,18.48c.83,0,1.5.67,1.5,1.5v2.23c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-2.23c0-.83.67-1.5,1.5-1.5Z"
          />
          <path
            fill="currentColor"
            d="M16.58,16.58c.59-.59,1.53-.59,2.12,0l1.58,1.58c.59.59.59,1.53,0,2.12s-1.53.59-2.12,0l-1.58-1.58c-.59-.59-.59-1.53,0-2.12Z"
          />
          <path
            fill="currentColor"
            d="M18.48,12c0-.83.67-1.5,1.5-1.5h2.23c.83,0,1.5.67,1.5,1.5s-.67,1.5-1.5,1.5h-2.23c-.83,0-1.5-.67-1.5-1.5Z"
          />
          <path
            fill="currentColor"
            d="M16.58,7.42c-.59-.59-.59-1.53,0-2.12l1.58-1.58c.59-.59,1.53-.59,2.12,0s.59,1.53,0,2.12l-1.58,1.58c-.59.59-1.53.59-2.12,0Z"
          />
          <path
            fill="currentColor"
            d="M12,5.52c-.83,0-1.5-.67-1.5-1.5V1.79c0-.83.67-1.5,1.5-1.5s1.5.67,1.5,1.5v2.23c0,.83-.67,1.5-1.5,1.5Z"
          />
        </g>
        <path
          ref={iconSunInner}
          style={{ transformOrigin: "center center" }}
          d="M17,12c0-3.41-1.59-5-5-5s-5,1.59-5,5,1.59,5,5,5,5-1.59,5-5Z"
          fill="currentColor"
        />
      </g>
      {/* ICON MOON */}
      <g ref={iconMoon} style={{ transformOrigin: "center center" }}>
        <path
          fill="currentColor"
          ref={iconStarLarge}
          d="m18.837 3.986-.831-.303c-.328-.12-.586-.373-.707-.694l-.308-.82c-.146-.391-.52-.649-.937-.649-.417 0-.79.259-.936.65l-.306.817c-.122.322-.38.576-.708.695l-.831.303c-.395.144-.657.52-.657.939s.263.795.657.939l.831.303c.328.12.586.373.707.693l.307.82c.146.391.519.65.936.65.417 0 .79-.258.937-.649l.307-.818c.122-.322.38-.576.708-.695l.831-.303c.395-.144.657-.52.657-.939s-.263-.795-.657-.939z"
        />
        <path
          opacity=".5"
          d="m22.386 12.003c-.402-.168-.87-.056-1.151.279-.928 1.106-2.507 1.621-4.968 1.621-3.814 0-6.179-1.03-6.179-6.158 0-2.397.532-4.019 1.626-4.957.33-.284.439-.749.269-1.15-.17-.4-.571-.646-1.015-.604-5.683.538-9.968 5.243-9.968 10.943 0 6.062 4.944 10.994 11.022 10.994 5.72 0 10.438-4.278 10.973-9.951.042-.436-.205-.848-.609-1.017z"
          fill="currentColor"
        />
        <g ref={starsContainerRef}>
          <circle fill="currentColor" cx="13.987" cy="10.757" r="1" />
          <circle fill="currentColor" cx="18.494" cy="11.347" r="1" />
        </g>
      </g>
    </svg>
  );
});
