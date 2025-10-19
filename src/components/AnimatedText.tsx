import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

// ===== PLUGIN REGISTRATION =====
gsap.registerPlugin(SplitText);

// ===== CONSTANTS =====
const ANIMATION_CONFIG = {
  DURATION: 0.6,
  STAGGER_AMOUNT: 0.1,
  Y_PERCENT_OUT: -120,
  Y_PERCENT_IN: 140,
} as const;

// ===== TYPES =====
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
  fontsLoaded?: boolean;
}

// ===== COMPONENT =====
const AnimatedText = ({
  linkText1,
  id,
  linkText2,
  className,
  Icon,
  fontsLoaded,
}: AnimatedTextProps) => {
  const linkRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!fontsLoaded || !linkRef.current) return;

    const linkElement = linkRef.current;
    const textElements = linkElement.querySelectorAll("[hoverstagger='text']");
    const splitTextInstances: SplitText[] = [];

    // Split text into characters
    textElements.forEach((el) => {
      const split = new SplitText(el as HTMLElement, {
        type: "chars,words",
        charsClass: "char",
      });
      splitTextInstances.push(split);
    });

    const [text1Split, text2Split] = splitTextInstances;

    // Create animation timeline
    const tl = gsap.timeline({ paused: true });

    if (text1Split && text2Split) {
      tl.to(text1Split.chars, {
        yPercent: ANIMATION_CONFIG.Y_PERCENT_OUT,
        duration: ANIMATION_CONFIG.DURATION,
        stagger: { amount: ANIMATION_CONFIG.STAGGER_AMOUNT },
      }).from(
        text2Split.chars,
        {
          yPercent: ANIMATION_CONFIG.Y_PERCENT_IN,
          duration: ANIMATION_CONFIG.DURATION,
          stagger: { amount: ANIMATION_CONFIG.STAGGER_AMOUNT },
        },
        0
      );
    }

    // Event handlers
    const handleMouseEnter = () => tl.restart();
    const handleMouseLeave = () => tl.reverse();

    linkElement.addEventListener("mouseenter", handleMouseEnter);
    linkElement.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      linkElement.removeEventListener("mouseenter", handleMouseEnter);
      linkElement.removeEventListener("mouseleave", handleMouseLeave);
      splitTextInstances.forEach((split) => split.revert());
    };
  }, [fontsLoaded]);

  return (
    <button
      className={`${className} cursor-pointer`}
      ref={linkRef}
      name={linkText1}
      id={id}
    >
      <div className="relative overflow-hidden z-[1]">
        <div
          hoverstagger="text"
          className="relative inline-block leading-[0.8]"
        >
          {linkText1}
        </div>
        <div hoverstagger="text" className="absolute inset-y-0 leading-[0.8]">
          {linkText2 ?? linkText1}
        </div>
      </div>
      {Icon && Icon}
    </button>
  );
};

export default AnimatedText;

// ===== TYPE AUGMENTATION =====
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    hoverstagger?: string;
  }
}
