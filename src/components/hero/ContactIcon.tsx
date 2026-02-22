import { memo, useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "../../utils";
import StartBrust from "../ui/StartBrust";
import { personalDetails } from "../../constants/PERSONAL_DETAILS";

const ContactIcon = memo(
  ({
    textClassName,
    bgClassName,
    className,
  }: {
    bgClassName?: string;
    textClassName?: string;
    className?: string;
  }) => {
    const contactIconRef = useRef<HTMLDivElement>(null);
    const iconId = useMemo(
      () => `contact-icon-${Math.random().toString(36).substring(2, 9)}`,
      [],
    );

    // Animation configuration
    const animConfig = useMemo(
      () => ({
        morphDuration: 0.8,
        lineDuration: 0.5,
        ease: "power2.inOut",
      }),
      [],
    );

    // Memoized handlers
    const { handleMouseEnter, handleMouseLeave } = useMemo(() => {
      const createMorphAnimation = (
        tl: gsap.core.Timeline,
        from: SVGPathElement,
        to: SVGPathElement,
        position?: string | number,
      ) => {
        tl.to(
          from,
          {
            morphSVG: { shape: to, shapeIndex: 0 },
            duration: animConfig.morphDuration,
            ease: animConfig.ease,
          },
          position,
        );
      };

      const handleMouseEnter = (elements: {
        closedBase: Element | null;
        closedPaper: Element | null;
        openBase: Element | null;
        openPaper: Element | null;
        openLine1: Element | null;
        openLine2: Element | null;
      }) => {
        const {
          closedBase,
          closedPaper,
          openBase,
          openPaper,
          openLine1,
          openLine2,
        } = elements;

        // Kill ongoing animations
        gsap.killTweensOf(Object.values(elements).filter(Boolean));

        if (!closedBase || !openBase || !closedPaper || !openPaper) return;

        const tl = gsap.timeline();

        // Morph shapes
        if (
          closedBase instanceof SVGPathElement &&
          openBase instanceof SVGPathElement
        ) {
          createMorphAnimation(tl, closedBase, openBase, 0);
        }
        if (
          closedPaper instanceof SVGPathElement &&
          openPaper instanceof SVGPathElement
        ) {
          createMorphAnimation(tl, closedPaper, openPaper, 0);
        }

        // Animate lines
        if (openLine1) {
          tl.to(openLine1, { opacity: 1, duration: 0.1 }, "+=0.1").to(
            openLine1,
            {
              drawSVG: "0% 100%",
              duration: animConfig.lineDuration,
              ease: "power2.out",
            },
            "<",
          );
        }
        if (openLine2) {
          tl.to(openLine2, { opacity: 1, duration: 0.1 }, "-=0.3").to(
            openLine2,
            {
              drawSVG: "100% 0%",
              duration: animConfig.lineDuration,
              ease: "power2.out",
            },
            "<",
          );
        }
      };

      const handleMouseLeave = (elements: {
        closedBase: Element | null;
        closedPaper: Element | null;
        openLine1: Element | null;
        openLine2: Element | null;
      }) => {
        const { closedBase, closedPaper, openLine1, openLine2 } = elements;

        // Kill ongoing animations
        gsap.killTweensOf(Object.values(elements).filter(Boolean));

        if (!closedBase || !closedPaper) return;

        const tl = gsap.timeline();

        // Hide lines
        if (openLine1 && openLine2) {
          tl.to([openLine1, openLine2], {
            drawSVG: "0%",
            duration: 0.4,
            ease: animConfig.ease,
          }).to([openLine1, openLine2], { opacity: 0, duration: 0.1 }, "-=0.1");
        }

        // Morph back
        if (closedPaper instanceof SVGPathElement) {
          tl.to(
            closedPaper,
            {
              morphSVG: { shape: closedPaper, shapeIndex: 0 },
              duration: animConfig.morphDuration,
              ease: animConfig.ease,
            },
            "+=0.1",
          );
        }
        if (closedBase instanceof SVGPathElement) {
          tl.to(
            closedBase,
            {
              morphSVG: { shape: closedBase, shapeIndex: 0 },
              duration: animConfig.morphDuration,
              ease: animConfig.ease,
            },
            "<",
          );
        }
      };

      return { handleMouseEnter, handleMouseLeave };
    }, [animConfig]);

    useGSAP(() => {
      const contactIcon = contactIconRef.current;
      if (!contactIcon) return;

      // Get all SVG elements
      const elements = {
        openPaper: contactIcon.querySelector(`.${iconId}-open-paper`),
        openBase: contactIcon.querySelector(`.${iconId}-open-base`),
        openLine1: contactIcon.querySelector(`.${iconId}-line1`),
        openLine2: contactIcon.querySelector(`.${iconId}-line2`),
        closedPaper: contactIcon.querySelector(`.${iconId}-closed-paper`),
        closedBase: contactIcon.querySelector(`.${iconId}-closed-base`),
      };

      // Set initial states
      gsap.set([elements.openPaper, elements.openBase], {
        visibility: "hidden",
        opacity: 0,
      });
      gsap.set([elements.openLine1, elements.openLine2], {
        drawSVG: "0%",
        opacity: 0,
      });

      // Event handlers with captured elements
      const onEnter = () => handleMouseEnter(elements);
      const onLeave = () => handleMouseLeave(elements);

      contactIcon.addEventListener("mouseenter", onEnter);
      contactIcon.addEventListener("mouseleave", onLeave);

      return () => {
        contactIcon.removeEventListener("mouseenter", onEnter);
        contactIcon.removeEventListener("mouseleave", onLeave);
      };
    }, [iconId, handleMouseEnter, handleMouseLeave]);

    return (
      <a
        href={`mailto:${personalDetails.email}`}
        className={cn(
          "flex items-center justify-center rounded-xl",
          "md:px-8 md:py-4",
          "min-w-[350px] md:min-w-[300px]",
          "text-foreground dark:text-background",
          className,
        )}
      >
        <div
          className={cn(
            "size-32 lg:size-40 relative uppercase justify-self-center-safe  group/contact rounded-ful text-background dark:text-foreground",
          )}
        >
          <div
            ref={contactIconRef}
            className="absolute inset-0 flex items-center justify-center size-full z-20 -translate-y-1"
          >
            <svg
              className={cn("size-8 md:size-12", textClassName)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
            >
              <path
                className={`${iconId}-open-paper ${textClassName}`}
                fill="currentColor"
                d="M105.33,34v26.53l-8,4.8v-31.33c0-9.31-.08-13.51-1.95-15.38s-6.07-1.95-15.38-1.95h-32c-9.31,0-13.51.08-15.38,1.95s-1.95,6.07-1.95,15.38v31.33l-8-4.8v-26.53c0-10.8,0-16.74,4.29-21.04,4.3-4.29,10.24-4.29,21.04-4.29h32c10.79,0,16.74,0,21.04,4.29,4.29,4.3,4.29,10.24,4.29,21.04Z"
              />
              <path
                fill="currentColor"
                className={`${iconId}-open-base ${textClassName}`}
                opacity={0.5}
                d="M117.22,53.4c0-.17,0-.27,0-.28-.18-2.66-.66-4.55-1.61-6.32-1.74-3.26-4.51-5.1-9.56-8.46l-.71-.47v9.66c1.75,1.26,2.73,2.13,3.21,3.05.38.7.57,1.55.67,2.93,0,.02,0,2.3,0,4.69l-3.89,2.33-8,4.8-16.87,10.12c-8.02,4.82-12.03,7.22-16.46,7.22s-8.44-2.4-16.46-7.22l-16.87-10.12-8-4.8-3.89-2.33v-4.69c.1-1.38.3-2.23.67-2.93.49-.92,1.47-1.8,3.22-3.05v-9.66l-.71.47c-5.05,3.36-7.83,5.2-9.56,8.46-.95,1.77-1.43,3.66-1.61,6.32,0,.01,0,.11,0,.28-.12,1.59-.11,3.53-.1,6.02.02,6.7.09,13.53.26,20.44.41,16.4.61,24.6,6.64,30.63,6.03,6.03,14.34,6.23,30.96,6.65,10.34.26,20.59.26,30.92,0,16.62-.42,24.93-.62,30.96-6.65,6.03-6.03,6.24-14.23,6.65-30.63.17-6.91.23-13.74.25-20.44.01-2.5.02-4.43-.1-6.02Z"
              />
              <line
                className={`${iconId}-line1 origin-left ${textClassName}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={"8px"}
                stroke="currentColor"
                x1="53.18"
                y1="34"
                x2="74.5"
                y2="34"
              />
              <line
                className={`${iconId}-line2 origin-left`}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={"8px"}
                x1="53.18"
                y1="55.33"
                x2="74.5"
                y2="55.33"
              />
              <path
                className={`${iconId}-closed-paper`}
                fill="currentColor"
                d="M64,70.7c-3.89,0-7.78-1.55-13.01-4.64l-15.69-9.28c-1.9-1.12-2.53-3.58-1.41-5.48,1.13-1.9,3.58-2.53,5.48-1.41l15.69,9.28c7.85,4.64,10.03,4.64,17.88,0l15.69-9.28c1.9-1.12,4.36-.49,5.48,1.41s.49,4.35-1.41,5.48l-15.69,9.28c-5.23,3.09-9.12,4.64-13.01,4.64Z"
              />
              <path
                className={`${iconId}-closed-base`}
                opacity={0.5}
                fill="currentColor"
                d="M10.75,79.87c.35,16.35.52,24.52,6.56,30.58,6.03,6.06,14.43,6.27,31.22,6.69,10.35.26,20.6.26,30.95,0,16.79-.42,25.19-.63,31.22-6.69,6.03-6.06,6.21-14.23,6.56-30.58.11-5.26.11-10.48,0-15.74-.35-16.35-.52-24.52-6.56-30.58-6.03-6.06-14.43-6.27-31.22-6.69-10.35-.26-20.6-.26-30.95,0-16.79.42-25.19.63-31.22,6.69-6.03,6.06-6.21,14.23-6.56,30.58-.11,5.26-.11,10.48,0,15.74Z"
              />
            </svg>
          </div>

          <StartBrust
            className={cn("dark:text-background text-foreground", bgClassName)}
            textClassName={cn("text-white dark:text-foreground", textClassName)}
          />
        </div>
      </a>
    );
  },
);

export default ContactIcon;
