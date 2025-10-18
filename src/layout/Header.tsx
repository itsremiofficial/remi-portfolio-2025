import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
  useLayoutEffect,
} from "react";
import { cn } from "../utils";
import { useClickOutside } from "../hooks/outsideClick";
import AnimatedText from "../components/AnimatedText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useScrollTo } from "../hooks/useLenis";
import { CustomEase } from "gsap/all";
import { useActiveSection } from "../hooks/useActiveSection";
import { useTheme } from "../hooks/useTheme";
import AnimatedTooltip from "../components/AnimatedTooltip";
import IconInstagram from "../components/icons/Instagram";
import TimeDisplay from "../components/DualTime";
import IconLinkedIn from "../components/icons/Linkedin";
import { MENU_ITEMS } from "../constants/MENU";

// ============================================================================
// CONSTANTS
// ============================================================================

const CUSTOM_EASE = "0.7, 0, 0.2, 1";
const ANIMATION_EASE_IN = "0.8, 0, 0.3, 1";
const SCROLL_THRESHOLD = 150;

const BREAKPOINTS = {
  SCROLL: {
    xs: "(max-width: 639px)",
    sm: "(min-width: 640px) and (max-width: 767px)",
    md: "(min-width: 768px)",
  },
  MENU: {
    xs: "(max-width: 639px)",
    sm: "(min-width: 640px) and (max-width: 767px)",
    md: "(min-width: 768px) and (max-width: 991px)",
    lg: "(min-width: 992px)",
  },
} as const;

const MENU_HEIGHTS = {
  CLOSED: 64,
  XS: 480,
  SM: 500,
  MD: 540,
  LG: 640,
} as const;

const MORPH_TARGETS = {
  COMPRESSED: {
    r: "#full-rounded-square",
    e: "#triangle",
    m: "#parallelogram",
    i: "#half-rounded-square",
  },
  EXPANDED: {
    r: "#r_letter",
    e: "#e_letter",
    m: "#m_letter",
    i: "#i_letter",
  },
} as const;

// ============================================================================
// TYPES
// ============================================================================

interface MenuItem {
  text: string;
  href: string;
}

interface SocialPlatform {
  social: string;
  href: string;
  icon: React.ComponentType<{ className?: string; fill?: boolean }>;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const Logo = memo(
  React.forwardRef<SVGSVGElement>((_props, ref) => (
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

Logo.displayName = "Logo";

const NavItem = memo<{
  item: MenuItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
  fontsLoaded: boolean;
}>(({ item, index, isActive, onClick, fontsLoaded }) => (
  <div
    className={cn(
      "link w-max inline-flex items-center gap-3 text-5xl lg:text-7xl font-extrabold opacity-0 cursor-pointer font-robo !font-var group/link transition-colors duration-400",
      "perspective-distant will-change-transform",
      isActive
        ? "text-accent"
        : "text-foreground/40 hover:text-foreground dark:hover:text-background dark:text-background/30"
    )}
    onClick={onClick}
  >
    <div>{index + 1}.</div>
    <div className="leading-0 cursor-pointer overflow-hidden">
      <AnimatedText
        linkText1={item.text}
        linkText2={item.text}
        className="link_text tracking-wide lg:tracking-normal leading-0 whitespace-nowrap"
        fontsLoaded={fontsLoaded}
      />
    </div>
  </div>
));

NavItem.displayName = "NavItem";

const SocialIcon = memo<{
  platform: SocialPlatform;
  index: number;
}>(({ platform, index }) => (
  <a
    href={platform.href}
    target="_blank"
    rel="noopener noreferrer"
    className="size-16 relative rounded-2xl social_icon"
  >
    <AnimatedTooltip
      id={index + 1}
      className={cn(
        "size-14 lg:size-16 p-3 lg:p-4 mask mask-squircle !aspect-square cursor-pointer",
        "bg-foreground/15 hover:bg-foreground/20",
        "text-foreground md:text-foreground/85 hover:text-foreground",
        "dark:bg-foreground/70 dark:hover:bg-foreground",
        "dark:text-background/70 dark:hover:text-background",
        "transition-colors duration-400"
      )}
      mains={platform.social}
      Children={<platform.icon className="size-full" fill />}
    />
  </a>
));

SocialIcon.displayName = "SocialIcon";

const ThemeIcon = memo<{ className?: string }>(({ className }) => {
  const { toggleThemeMode, isDark } = useTheme();
  const iconSun = useRef<SVGPathElement>(null);
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

  useEffect(() => {
    if (!(iconSun.current && iconMoon.current)) return;

    // Cleanup existing animations
    animationTimelineRef.current.moon?.kill();
    animationTimelineRef.current.sun?.kill();

    const tlDefaults = { ease: "power2.inOut", force3D: true };
    const tlMoon = gsap.timeline({ defaults: tlDefaults });
    const tlSun = gsap.timeline({ defaults: tlDefaults });

    animationTimelineRef.current = { moon: tlMoon, sun: tlSun };

    // Moon animations
    tlMoon.to(iconMoon.current, {
      opacity: isDark ? 1 : 0,
      duration: 0.3,
      rotateZ: isDark ? 0 : 180,
    });

    if (starsContainerRef.current) {
      const smallStars = starsContainerRef.current.querySelectorAll("circle");
      tlMoon.to(
        smallStars,
        {
          opacity: isDark ? 1 : 0,
          duration: 0.3,
          scale: isDark ? 1 : 0,
          stagger: 0.08,
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

    // Sun animations
    tlSun.to(
      iconSun.current,
      {
        opacity: isDark ? 0 : 1,
        duration: 0.3,
        rotateZ: isDark ? -180 : 0,
      },
      "<"
    );

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
          stagger: 0.04,
        },
        "<0.1"
      );
    }

    return () => {
      tlMoon.kill();
      tlSun.kill();
    };
  }, [isDark]);

  return (
    <svg
      className={cn("text-foreground dark:text-background", className)}
      onClick={toggleThemeMode}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
          style={{ transformOrigin: "center center" }}
          d="M17,12c0-3.41-1.59-5-5-5s-5,1.59-5,5,1.59,5,5,5,5-1.59,5-5Z"
          fill="currentColor"
        />
      </g>
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

ThemeIcon.displayName = "ThemeIcon";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const createMorphAnimation = (
  target: HTMLElement,
  letters: typeof MORPH_TARGETS.COMPRESSED | typeof MORPH_TARGETS.EXPANDED,
  width: string | number
) => {
  const tl = gsap.timeline();

  tl.to(target, {
    width,
    duration: 1,
    ease: "power3.out",
  });

  Object.entries(letters).forEach(([key, morphTarget], index) => {
    tl.to(
      `#${key}_letter`,
      {
        morphSVG: morphTarget,
        duration: 1.5,
        ease: "power2.out",
      },
      index === 0 ? "<" : "<0.05"
    );
  });

  return tl;
};

const applyMorphState = (
  target: HTMLElement,
  state: "small" | "full",
  width: string | number
) => {
  const letters = state === "small" ? MORPH_TARGETS.COMPRESSED : MORPH_TARGETS.EXPANDED;

  gsap.set(target, { width });
  Object.entries(letters).forEach(([key, morphTarget]) => {
    gsap.set(`#${key}_letter`, { morphSVG: morphTarget });
  });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Header = ({ fontsLoaded }: { fontsLoaded: boolean }) => {
  const { scrollToElement } = useScrollTo();
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const morphTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const ease = useMemo(() => CustomEase.create("custom", CUSTOM_EASE), []);

  const sectionIds = useMemo(
    () => MENU_ITEMS.map((item) => item.href.replace("#", "")),
    []
  );
  const activeSection = useActiveSection(sectionIds);

  const socialPlatforms = useMemo<SocialPlatform[]>(
    () => [
      {
        social: "Instagram",
        href: "https://fronus.com",
        icon: IconInstagram,
      },
      {
        social: "LinkedIn",
        href: "https://discord.com",
        icon: IconLinkedIn,
      },
    ],
    []
  );

  const toggleMenu = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

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

  useClickOutside(drawerRef, () => {
    if (isExpanded) toggleMenu();
  });

  // Logo morph animation on scroll
  useLayoutEffect(() => {
    let lastKnownScrollY = 0;
    let ticking = false;
    let animationState: "small" | "full" =
      window.scrollY >= SCROLL_THRESHOLD ? "small" : "full";

    const mm = gsap.matchMedia();

    mm.add(BREAKPOINTS.SCROLL, (context) => {
      const { md } = context.conditions as Record<string, boolean>;
      const smallWidth = md ? 420 : "100%";

      if (!menuContainerRef.current) return;

      applyMorphState(menuContainerRef.current, animationState, animationState === "small" ? smallWidth : "100%");

      const handleScroll = () => {
        lastKnownScrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const newState: "small" | "full" =
              lastKnownScrollY >= SCROLL_THRESHOLD ? "small" : "full";

            if (newState !== animationState && menuContainerRef.current) {
              animationState = newState;
              morphTimelineRef.current?.kill();

              const targetWidth = animationState === "small" ? smallWidth : "100%";
              const targetLetters = animationState === "small" ? MORPH_TARGETS.COMPRESSED : MORPH_TARGETS.EXPANDED;

              morphTimelineRef.current = createMorphAnimation(
                menuContainerRef.current,
                targetLetters,
                targetWidth
              );
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    });

    return () => {
      morphTimelineRef.current?.kill();
      mm.kill();
    };
  }, []);

  // Menu expand/collapse animation
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(BREAKPOINTS.MENU, (context) => {
      const { sm, md, lg } = context.conditions as Record<string, boolean>;

      const openHeight = sm ? MENU_HEIGHTS.SM : md ? MENU_HEIGHTS.MD : lg ? MENU_HEIGHTS.LG : MENU_HEIGHTS.XS;
      const closedHeight = MENU_HEIGHTS.CLOSED;

      const tl = gsap.timeline({ paused: true, immediateRender: false });

      if (isExpanded) {
        tl.addLabel("start")
          .to(
            menuContainerRef.current,
            {
              height: openHeight,
              opacity: 1,
              backgroundColor: isDark ? "#030711cc" : "#ffffff8a",
              duration: 0.8,
              ease: CUSTOM_EASE,
              force3D: true,
            },
            "start"
          )
          .to(
            menuContainerRef.current,
            {
              borderRadius: 2,
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
          .to(
            ".nav-links-container .link",
            {
              ease: CUSTOM_EASE,
              opacity: 1,
              stagger: 0.1,
              rotationX: 0,
              z: 0,
              force3D: true,
            },
            "-=0.1"
          )
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
              force3D: true,
            },
            "-=0.3"
          )
          .to(
            ".menu_button",
            {
              padding: "17.20px 32px",
              duration: 0.4,
            },
            "<"
          )
          .to(
            menuContainerRef.current,
            {
              height: closedHeight,
              borderRadius: "1.5rem",
              backgroundColor: isDark ? "#030711cc" : "#ffffff8a",
              duration: 0.6,
              ease: ANIMATION_EASE_IN,
              force3D: true,
            },
            "<"
          );
      }

      tl.play();
      return () => tl.kill();
    });

    return () => mm.kill();
  }, [isExpanded, isDark]);

  return (
    <header className="sticky right-0 top-0 p-4 z-[99] h-24">
      <div
        ref={drawerRef}
        className="flex items-center justify-center group/button relative w-full h-full"
      >
        <div
          ref={menuContainerRef}
          className={cn(
            "absolute top-0 border w-full h-16 rounded-3xl z-[100] overflow-hidden origin-top-right space-y-3 backdrop-blur-2xl",
            "bg-nav-background/10 dark:bg-nav-foreground/70",
            "border-black/10 dark:border-background/12",
            "will-change-[width,height,borderRadius]"
          )}
        >
          <div className="menu_button flex justify-between items-center py-[17.20px] px-8 !m-0 will-change-[padding]">
            <a href="/" aria-label="Home">
              <Logo ref={logoRef} />
            </a>

            <button
              className={`nav-wrapper !h-6 !w-6 ${isExpanded ? "open" : ""}`}
              onClick={toggleMenu}
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              aria-expanded={isExpanded}
            >
              <div className="line-menu !w-1/2" />
              <div className="line-menu !w-full" />
              <div className="line-menu !w-1/2" />
            </button>
          </div>

          <div className="space-y-6 md:space-y-8 px-6 md:px-8">
            <nav className="nav-links-container flex flex-col gap-2">
              <h4
                className={cn(
                  "nav-links-heading select-none",
                  "font-mono tracking-widest",
                  "text-foreground/30 dark:text-background/40",
                  "sm:text-base text-xs",
                  "will-change-[opacity,transform]"
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
                    onClick={() => handleNavItemClick(item.href.replace("#", ""))}
                    fontsLoaded={fontsLoaded}
                  />
                );
              })}
            </nav>

            <div className="flex gap-4 sm:gap-10 md:gap-14 lg:gap-20">
              <div className="space-y-2 lg:space-y-3">
                <h4
                  className={cn(
                    "nav-links-heading select-none",
                    "font-mono tracking-widest",
                    "text-foreground/30 dark:text-background/40",
                    "sm:text-base text-xs",
                    "will-change-[opacity,transform]"
                  )}
                >
                  SOCIALS
                </h4>
                <div className="social_icons flex items-center lg:gap-6 relative">
                  {socialPlatforms.map((platform, index) => (
                    <SocialIcon key={platform.social} platform={platform} index={index} />
                  ))}
                </div>
              </div>

              <div className="space-y-2 lg:space-y-3">
                <h4
                  className={cn(
                    "nav-links-heading select-none",
                    "font-mono tracking-widest",
                    "text-foreground/30 dark:text-background/40",
                    "sm:text-base text-xs",
                    "will-change-[opacity,transform]"
                  )}
                >
                  THEME
                </h4>
                <div className="theme_icon will-change-[opacity,transform]">
                  <AnimatedTooltip
                    id={3}
                    className={cn(
                      "size-14 lg:size-16 p-3 lg:p-4 mask mask-squircle !aspect-square cursor-pointer",
                      "bg-foreground/15 hover:bg-foreground/20",
                      "text-foreground md:text-foreground/85 hover:text-foreground",
                      "dark:bg-foreground/70 dark:hover:bg-foreground",
                      "dark:text-background/70 dark:hover:text-background",
                      "transition-colors duration-400"
                    )}
                    mains={isDark ? "Dark Mode" : "Light Mode"}
                    Children={<ThemeIcon className="size-full !text-inherit" />}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between font-mono tracking-widest text-foreground/70 dark:text-background/50 text-xs md:pt-4">
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
