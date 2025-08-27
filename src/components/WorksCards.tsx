// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useRef } from "react";
// import WORKS from "../constants/WORKS";
// import { useGSAP } from "@gsap/react";
// import horizontalLoop from "../utils/horizontalLoop";
// import { Draggable, Observer } from "gsap/all";
// import gsap from "gsap";

// gsap.registerPlugin(Observer);

// const WorksCards = () => {
//   const worksRef = useRef<HTMLDivElement>(null);

//   useGSAP();
//   return (
//     <div ref={worksRef} className="flex items-center justify-center">
//       {WORKS.map(({ title, imageUrl }, index) => (
//         <div key={index} className="m-4 marquee-works-card">
//           <div className="relative ml-20">
//             <div className="absolute right-0 top-2 flex items-center justify-center rounded-full w-14 h-1/3 bg-foreground">
//               <div className="flex items-center gap-2 rotate-270 text-background dark:text-foreground text-xl leading-none font-robo font-extrabold whitespace-nowrap">
//                 <div className="rotate-180">
//                   <span>❮</span>
//                   <span className="relative -left-1">❮</span>
//                   <span className="relative -left-2">❮</span>
//                 </div>
//                 <div>© 2023</div>
//               </div>
//             </div>
//             <div className="box-inverted relative flex items-center justify-center">
//               <img
//                 src={imageUrl}
//                 alt={title}
//                 className="size-full object-cover"
//               />
//             </div>
//             <div className="absolute left-0 bottom-2 flex items-center h-[100px] bg-foreground w-[440px] inverted-card-bottom">
//               <div className="text-3xl leading-none flex items-center pl-8">
//                 <div className="font-nippo font-medium text-accent tracking-wide mr-4">
//                   [{index + 1}]
//                 </div>
//                 <div className="font-extrabold text-background font-robo">
//                   {title}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default WorksCards;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useCallback } from "react";
import WORKS from "../constants/WORKS";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/all";
import horizontalLoop from "../utils/horizontalLoop";

gsap.registerPlugin(Observer);

const WorksCards = () => {
  const worksRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const loopRef = useRef<any>(null);

  // Use refs for touch positions to avoid state updates during drag
  const touchStartRef = useRef(0);
  const touchXRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Refs for lerp
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);

  // Menu dimensions using refs to avoid re-render loops
  const menuWidthRef = useRef(0);
  const itemWidthRef = useRef(0);

  // Lerp function for smooth interpolation
  const lerp = useCallback((v0: number, v1: number, t: number): number => {
    return v0 * (1 - t) + v1 * t;
  }, []);

  // Update menu dimensions
  const updateDimensions = useCallback(() => {
    if (!worksRef.current || itemsRef.current.length === 0) return;

    const $menu = worksRef.current;
    const $items = itemsRef.current;

    menuWidthRef.current = $menu.clientWidth;
    itemWidthRef.current = $items[0]?.clientWidth || 0;
  }, []);

  useGSAP(() => {
    if (!worksRef.current || itemsRef.current.length === 0) return;

    const $menu = worksRef.current;

    // Initialize dimensions
    updateDimensions();

    // Create horizontal loop for automatic scrolling
    document.fonts.ready.then(() => {
      loopRef.current = horizontalLoop(".marquee-works-card", {
        repeat: -1,
        speed: 1.5,
      });

      let tl: GSAPTimeline | null = null;

      // Observer for scroll wheel interactions
      Observer.create({
        target: window,
        type: "wheel",
        onChangeY: (self) => {
          if (isDraggingRef.current) return; // Don't interfere with dragging

          tl?.kill();
          const factor = self.deltaY > 0 ? 1.5 : -1.5;
          tl = gsap
            .timeline()
            .to(loopRef.current, { timeScale: factor, duration: 0.25 })
            .to(loopRef.current, { timeScale: 1 * factor, duration: 1 });
        },
      });
    });

    /*--------------------
    Touch/Mouse Events
    --------------------*/
    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      const clientX = e.clientX;
      touchStartRef.current = clientX;
      touchXRef.current = clientX;
      isDraggingRef.current = true;
      $menu.classList.add("is-dragging");

      // Pause the horizontal loop when user starts dragging
      if (loopRef.current) {
        loopRef.current.pause();
        currentTimeRef.current = loopRef.current.time();
        targetTimeRef.current = currentTimeRef.current;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      e.preventDefault();
      const clientX = e.clientX;
      const deltaX = clientX - touchXRef.current;

      // Update target time based on drag distance
      targetTimeRef.current -= deltaX * 0.01; // Adjust factor for sensitivity

      touchXRef.current = clientX;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      $menu.classList.remove("is-dragging");

      // Resume the horizontal loop when user stops dragging
      if (loopRef.current) {
        loopRef.current.play();
      }
    };

    /*--------------------
    Listeners
    --------------------*/
    // Use pointer events for better cross-device support
    $menu.addEventListener("pointerdown", handlePointerDown);
    $menu.addEventListener("pointermove", handlePointerMove);
    $menu.addEventListener("pointerup", handlePointerUp);
    $menu.addEventListener("pointerleave", handlePointerUp);

    $menu.addEventListener("selectstart", (e) => {
      e.preventDefault();
      return false;
    });

    /*--------------------
    Resize
    --------------------*/
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);

    /*--------------------
    Render
    --------------------*/
    const render = () => {
      requestAnimationFrame(render);

      if (loopRef.current) {
        // Lerp current time towards target time
        currentTimeRef.current = lerp(
          currentTimeRef.current,
          targetTimeRef.current,
          0.01
        );

        // Set the loop's time, wrapping around the duration
        const duration = loopRef.current.totalDuration();
        loopRef.current.time(currentTimeRef.current % duration);
      }
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      $menu.removeEventListener("pointerdown", handlePointerDown);
      $menu.removeEventListener("pointermove", handlePointerMove);
      $menu.removeEventListener("pointerup", handlePointerUp);
      $menu.removeEventListener("pointerleave", handlePointerUp);
      $menu.removeEventListener("selectstart", () => false);

      // Kill the horizontal loop
      if (loopRef.current) {
        loopRef.current.kill();
      }
    };
  }, []); // Remove all dependencies to prevent infinite loops

  // Initial setup effect
  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  return (
    <div
      ref={worksRef}
      className="menu flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: "none" }} // Prevent default touch behaviors
    >
      <div className="menu--wrapper flex">
        {WORKS.map(({ title, imageUrl }, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            className="menu--item m-4 marquee-works-card flex-shrink-0"
          >
            <div className="relative ml-20">
              <div className="absolute right-0 top-2 flex items-center justify-center rounded-full w-14 h-1/3 bg-foreground">
                <div className="flex items-center gap-2 rotate-270 text-background dark:text-foreground text-xl leading-none font-robo font-extrabold whitespace-nowrap">
                  <div className="rotate-180">
                    <span>❮</span>
                    <span className="relative -left-1">❮</span>
                    <span className="relative -left-2">❮</span>
                  </div>
                  <div>© 2023</div>
                </div>
              </div>
              <div className="box-inverted relative flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={title}
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute left-0 bottom-2 flex items-center h-[100px] bg-foreground w-[440px] inverted-card-bottom">
                <div className="text-3xl leading-none flex items-center pl-8">
                  <div className="font-nippo font-medium text-accent tracking-wide mr-4">
                    [{index + 1}]
                  </div>
                  <div className="font-extrabold text-background font-robo">
                    {title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksCards;
