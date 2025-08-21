// import { type FC, useEffect, useRef } from "react";
// import gsap from "gsap";
// import { SplitText } from "gsap/SplitText";

// gsap.registerPlugin(SplitText);

// interface SplitTitleProps {
//   text: string;
//   start?: boolean; // trigger forward animation
//   end?: boolean; // trigger reverse animation
//   fontsLoaded?: boolean; // trigger reverse animation
// }

// const SplitTitle: FC<SplitTitleProps> = ({
//   text,
//   start = false,
//   end = false,
//   fontsLoaded = true,
// }) => {
//   const titleRef = useRef<HTMLHeadingElement | null>(null);
//   const charsRef = useRef<HTMLElement[]>([]);
//   const splitRef = useRef<SplitText | null>(null);
//   const isInitialized = useRef(false);

//   // Initialize SplitText when fonts are loaded
//   useEffect(() => {
//     if (!fontsLoaded || !titleRef.current) return;

//     // Create SplitText instance
//     try {
//       const split = new SplitText(titleRef.current, { type: "chars" });
//       splitRef.current = split;
//       charsRef.current = split.chars as HTMLElement[];

//       // Add character wrappers
//       charsRef.current.forEach((char) => {
//         const wrapper = document.createElement("span");
//         wrapper.classList.add("char-wrap");
//         char.parentNode?.insertBefore(wrapper, char);
//         wrapper.appendChild(char);
//       });

//       // Set initial state for animation
//       gsap.set(charsRef.current, {
//         xPercent: -250,
//         rotationZ: 45,
//         scaleX: 6,
//         transformOrigin: "100% 50%",
//       });

//       isInitialized.current = true;
//     } catch (error) {
//       console.error("Error initializing SplitText:", error);
//     }

//     // Cleanup
//     return () => {
//       if (splitRef.current) {
//         splitRef.current.revert();
//         splitRef.current = null;
//         charsRef.current = [];
//         isInitialized.current = false;
//       }
//     };
//   }, [fontsLoaded]);

//   // Handle start animation
//   useEffect(() => {
//     if (start && isInitialized.current && charsRef.current.length > 0) {
//       gsap.to(charsRef.current, {
//         duration: 1,
//         ease: "power2",
//         xPercent: 0,
//         rotationZ: 0,
//         scaleX: 1,
//         stagger: -0.06,
//       });
//     }
//   }, [start]);

//   // Handle end animation
//   useEffect(() => {
//     if (end && isInitialized.current && charsRef.current.length > 0) {
//       gsap.to(charsRef.current, {
//         duration: 1,
//         ease: "power2.inOut",
//         xPercent: -250,
//         rotationZ: 45,
//         scaleX: 6,
//       });
//     }
//   }, [end]);

//   return (
//     <span ref={titleRef} className="content__title">
//       {text}
//     </span>
//   );
// };

// export default SplitTitle;

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface AnimatedTextProps {
  text: string;
  fontsLoaded: boolean;
}

const SplitTitle: React.FC<AnimatedTextProps> = ({ text, fontsLoaded }) => {
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!fontsLoaded || !textRef.current) return;

    const split = new SplitText(textRef.current, { type: "chars" });
    const chars = split.chars ?? [];

    // Fix: Use explicit casting for each element in the array
    chars.forEach((char) => {
      // Cast Element to HTMLElement
      const element = char as HTMLElement;
      const wrapEl = document.createElement("span");
      wrapEl.className = "char-wrap";
      element.parentNode?.insertBefore(wrapEl, element);
      wrapEl.appendChild(element);
    });

    gsap.fromTo(
      chars,
      {
        willChange: "transform",
        xPercent: -250,
        rotationZ: 45,
        scaleX: 6,
        transformOrigin: "100% 50%",
      },
      {
        duration: 1,
        ease: "power2",
        xPercent: 0,
        rotationZ: 0,
        scaleX: 1,
        stagger: -0.06,
      }
    );
    return () => {
      split.revert();
    };
  }, [fontsLoaded]);

  return (
    <span ref={textRef} className="content__title" data-splitting data-effect12>
      {text}
    </span>
  );
};

export default SplitTitle;
