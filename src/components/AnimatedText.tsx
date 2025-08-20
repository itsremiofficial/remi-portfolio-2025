import React, { type ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

// Register the SplitText plugin
gsap.registerPlugin(SplitText);

// Define types for the icon props
interface IconProps {
  className?: string;
  fill?: string | boolean;
  duotone?: boolean;
  width?: string | number;
}

interface AnimatedTextProps {
  linkText1: string;
  id?: string;
  linkText2?: string;
  className?: string;
  Icon?: ReactNode;
  iconProps?: IconProps;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  linkText1,
  id,
  linkText2,
  className,
  Icon,
}) => {
  const linkRef = useRef<HTMLButtonElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // First effect to check if fonts are loaded
  useEffect(() => {
    // Check if the browser supports the document.fonts API
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback for browsers without font loading API - wait a moment
      setTimeout(() => {
        setFontsLoaded(true);
      }, 500);
    }
  }, []);

  // Second effect that runs after fonts are loaded
  useEffect(() => {
    // Only proceed if fonts are loaded and element exists
    if (!fontsLoaded || !linkRef.current) return;

    const linkElement = linkRef.current;
    const textElements = linkElement.querySelectorAll("[hoverstagger='text']");

    // Create an array to store our SplitText instances for cleanup
    const splitTextInstances: SplitText[] = [];

    // Split each text element using GSAP's SplitText
    textElements.forEach((el) => {
      const split = new SplitText(el as HTMLElement, {
        type: "chars,words",
        charsClass: "char",
      });
      splitTextInstances.push(split);
    });

    const tl = gsap.timeline({ paused: true });

    const [text1Split, text2Split] = splitTextInstances;
    if (text1Split && text2Split) {
      tl.to(text1Split.chars, {
        yPercent: -120,
        duration: 0.3,
        stagger: { amount: 0.2 },
      }).from(
        text2Split.chars,
        {
          yPercent: 200,
          duration: 0.3,
          stagger: { amount: 0.2 },
        },
        0
      );
    }

    const handleMouseEnter = () => tl.restart();
    const handleMouseLeave = () => tl.reverse();

    linkElement.addEventListener("mouseenter", handleMouseEnter);
    linkElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      linkElement.removeEventListener("mouseenter", handleMouseEnter);
      linkElement.removeEventListener("mouseleave", handleMouseLeave);

      // Revert all splits to clean up the DOM
      splitTextInstances.forEach((split) => split.revert());
    };
  }, [fontsLoaded]); // Depend on fontsLoaded

  return (
    <button
      className={`${className} cursor-pointer`}
      ref={linkRef}
      name={linkText1}
      id={id}
    >
      <div className="relative overflow-hidden z-[1] leading-none">
        <div hoverstagger="text" className="relative inline-block">
          {linkText1}
        </div>
        <div hoverstagger="text" className="absolute inset-y-0">
          {linkText2 ? linkText2 : linkText1}
        </div>
      </div>
      {Icon && Icon}
    </button>
  );
};

export default AnimatedText;

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    hoverstagger?: string;
  }
}
