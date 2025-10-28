// import { useEffect, useRef, useState, useCallback } from "react";
// import gsap from "gsap";

// interface PreloaderProps {
//   onComplete?: () => void;
// }

// const Preloader = ({ onComplete }: PreloaderProps) => {
//   const [progress, setProgress] = useState(0);
//   const [currentCount, setCurrentCount] = useState(0);
//   const [isComplete, setIsComplete] = useState(false);

//   // Refs for elements
//   const preloaderRef = useRef<HTMLDivElement>(null);
//   const counterRef = useRef<HTMLDivElement>(null);
//   const progressBarRef = useRef<HTMLDivElement>(null);
//   const topRowRef = useRef<HTMLDivElement>(null);
//   const bottomRowRef = useRef<HTMLDivElement>(null);
//   const leftColumnRef = useRef<HTMLDivElement>(null);
//   const rightColumnRef = useRef<HTMLDivElement>(null);
//   const line0to25Ref = useRef<HTMLDivElement>(null);
//   const line25to50Ref = useRef<HTMLDivElement>(null);
//   const line50to75Ref = useRef<HTMLDivElement>(null);
//   const line75to100Ref = useRef<HTMLDivElement>(null);
//   const block1Ref = useRef<HTMLDivElement>(null);
//   const block2Ref = useRef<HTMLDivElement>(null);
//   const block3Ref = useRef<HTMLDivElement>(null);
//   const block4Ref = useRef<HTMLDivElement>(null);

//   const [currentMessage, setCurrentMessage] = useState(0);
//   const messages = [
//     "INITIALIZING",
//     "DATA_TRANSFER",
//     "COMPILING",
//     "FINALIZING",
//     "COMPLETE",
//   ];

//   // Complete loading animation
//   const completeLoading = useCallback(() => {
//     const tl = gsap.timeline({
//       onComplete: () => {
//         onComplete?.();
//       },
//     });

//     tl.to(preloaderRef.current, {
//       y: "-100%",
//       duration: 1,
//       ease: "power2.inOut",
//     }).set(preloaderRef.current, {
//       display: "none",
//     });
//   }, [onComplete]);

//   // Track loading progress
//   useEffect(() => {
//     let loadedResources = 0;
//     let totalResources = 0;

//     // Track fonts
//     const fontPromises: Promise<void>[] = [];
//     if ("fonts" in document) {
//       document.fonts.forEach(() => {
//         totalResources++;
//       });

//       const fontPromise = document.fonts.ready.then(() => {
//         loadedResources += document.fonts.size;
//         updateProgress();
//       });
//       fontPromises.push(fontPromise);
//     } else {
//       // Fallback: assume fonts loaded after delay
//       totalResources += 5;
//       setTimeout(() => {
//         loadedResources += 5;
//         updateProgress();
//       }, 500);
//     }

//     // Track images
//     const images = document.querySelectorAll("img");
//     images.forEach((img) => {
//       totalResources++;
//       if (img.complete) {
//         loadedResources++;
//       } else {
//         img.addEventListener("load", () => {
//           loadedResources++;
//           updateProgress();
//         });
//         img.addEventListener("error", () => {
//           loadedResources++;
//           updateProgress();
//         });
//       }
//     });

//     // Track background images
//     const elementsWithBg = document.querySelectorAll(
//       "[style*='background-image']"
//     );
//     elementsWithBg.forEach((el) => {
//       totalResources++;
//       const bgImage = window.getComputedStyle(el).backgroundImage;
//       const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
//       if (match) {
//         const img = new Image();
//         img.onload = () => {
//           loadedResources++;
//           updateProgress();
//         };
//         img.onerror = () => {
//           loadedResources++;
//           updateProgress();
//         };
//         img.src = match[1];
//       } else {
//         loadedResources++;
//       }
//     });

//     // Minimum resources for progress calculation
//     if (totalResources === 0) {
//       totalResources = 10;
//       // Simulate loading over time
//       const interval = setInterval(() => {
//         loadedResources++;
//         updateProgress();
//         if (loadedResources >= totalResources) {
//           clearInterval(interval);
//         }
//       }, 200);
//     }

//     function updateProgress() {
//       const calculatedProgress = Math.min(
//         100,
//         Math.floor((loadedResources / totalResources) * 100)
//       );
//       setProgress(calculatedProgress);
//     }

//     // Initial update
//     updateProgress();
//   }, []);

//   // Update counter with animation
//   useEffect(() => {
//     const animateCounter = () => {
//       if (currentCount < progress) {
//         const step = progress - currentCount > 10 ? 2 : 1;
//         setTimeout(() => {
//           setCurrentCount((prev) => Math.min(progress, prev + step));
//         }, 40);
//       }
//     };
//     animateCounter();
//   }, [progress, currentCount]);

//   // Update system messages
//   useEffect(() => {
//     const messageIndex = Math.min(4, Math.floor(progress / 20));
//     setCurrentMessage(messageIndex);
//   }, [progress]);

//   // Update visual elements based on progress
//   useEffect(() => {
//     // Update progress bar
//     if (progressBarRef.current) {
//       progressBarRef.current.style.width = `${progress}%`;
//     }

//     // Update grid lines
//     if (topRowRef.current) topRowRef.current.style.width = `${progress}%`;
//     if (bottomRowRef.current) bottomRowRef.current.style.width = `${progress}%`;
//     if (leftColumnRef.current)
//       leftColumnRef.current.style.height = `${progress}%`;
//     if (rightColumnRef.current)
//       rightColumnRef.current.style.height = `${progress}%`;

//     // Update connector lines
//     if (line0to25Ref.current) {
//       const scale0to25 = Math.min(1, Math.max(0, progress - 0) / 25);
//       line0to25Ref.current.style.transform = `scaleX(${scale0to25})`;
//     }
//     if (line25to50Ref.current) {
//       const scale25to50 = Math.min(1, Math.max(0, progress - 25) / 25);
//       line25to50Ref.current.style.transform = `scaleX(${scale25to50})`;
//     }
//     if (line50to75Ref.current) {
//       const scale50to75 = Math.min(1, Math.max(0, progress - 50) / 25);
//       line50to75Ref.current.style.transform = `scaleX(${scale50to75})`;
//     }
//     if (line75to100Ref.current) {
//       const scale75to100 = Math.min(1, Math.max(0, progress - 75) / 25);
//       line75to100Ref.current.style.transform = `scaleX(${scale75to100})`;
//     }

//     // Update blocks
//     if (block1Ref.current && progress >= 20) {
//       const scale = Math.min(1, (progress - 20) / 20);
//       block1Ref.current.style.transform = `scale(${scale})`;
//     }
//     if (block2Ref.current && progress >= 40) {
//       const scale = Math.min(1, (progress - 40) / 20);
//       block2Ref.current.style.transform = `scale(${scale})`;
//     }
//     if (block3Ref.current && progress >= 60) {
//       const scale = Math.min(1, (progress - 60) / 20);
//       block3Ref.current.style.transform = `scale(${scale})`;
//     }
//     if (block4Ref.current && progress >= 80) {
//       const scale = Math.min(1, (progress - 80) / 20);
//       block4Ref.current.style.transform = `scale(${scale})`;
//     }

//     // Complete loading
//     if (progress >= 100 && !isComplete) {
//       setIsComplete(true);
//       setTimeout(() => {
//         completeLoading();
//       }, 800);
//     }
//   }, [progress, isComplete, completeLoading]);

//   return (
//     <div
//       className="fixed top-0 left-0 w-full h-screen z-[1000] flex flex-col overflow-hidden bg-background dark:bg-foreground"
//       ref={preloaderRef}
//     >
//       {/* Pixel grid elements */}
//       <div className="absolute top-0 left-0 w-full h-full z-20">
//         <div
//           className="absolute bg-red-500 opacity-25 h-1 w-0 left-0 transition-[width] duration-300 top-1/5"
//           id="top-row"
//           ref={topRowRef}
//         />
//         <div
//           className="absolute bg-red-500 opacity-25 h-1 w-0 left-0 transition-[width] duration-300 bottom-1/5"
//           id="bottom-row"
//           ref={bottomRowRef}
//         />
//         <div
//           className="absolute bg-red-500 opacity-25 w-1 h-0 top-0 transition-[height] duration-300 left-1/5"
//           id="left-column "
//           ref={leftColumnRef}
//         />
//         <div
//           className="absolute bg-red-500 opacity-25 w-1 h-0 top-0 transition-[height] duration-300 right-1/5"
//           id="right-column"
//           ref={rightColumnRef}
//         />
//       </div>

//       {/* Massive counter */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] w-full text-center">
//         <div
//           className="text-[clamp(8rem,20vw,20rem)] font-bold leading-[0.8] text-foreground relative inline-block font-mono"
//           ref={counterRef}
//         >
//           {currentCount}
//         </div>
//         <div
//           className="text-[clamp(8rem,20vw,20rem)] font-bold leading-[0.8] text-transparent [--stroke-color:var(--color-destructive)] [-webkit-text-stroke:1px_var(--color-foreground)] absolute top-1 left-1 size-full -z-10 font-mono pointer-events-none"
//           aria-hidden="true"
//         >
//           {currentCount}
//         </div>
//       </div>

//       {/* Status text */}
//       <div className="absolute top-8 left-8 z-10">
//         <div className="text-3xl font-bold mb-4 opacity-90 font-mono text-foreground">
//           LOADING SYSTEM
//         </div>
//         <div className="text-base font-normal leading-[1.5] opacity-60 h-[1.5em] overflow-hidden font-mono text-foreground">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={index === currentMessage ? "block" : "hidden"}
//             >
//               {message}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Progress markers */}
//       <div className="absolute bottom-12 left-8 right-8 z-10">
//         <div className="h-1 w-full bg-foreground/10 mb-[10px] relative">
//           <div
//             className="h-full w-0 bg-foreground transition-[width] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
//             ref={progressBarRef}
//           />
//         </div>
//         <div className="flex justify-between w-full text-xs opacity-60 relative font-mono text-foreground">
//           <div
//             className="relative pt-[10px] transition-opacity duration-300 ease-in-out before:absolute before:top-[-15px] before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:h-1.5 before:bg-foreground"
//             data-position="0"
//           >
//             00
//           </div>
//           <div
//             className="relative pt-[10px] transition-opacity duration-300 ease-in-out before:absolute before:top-[-15px] before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:h-1.5 before:bg-foreground"
//             data-position="25"
//           >
//             25
//           </div>
//           <div
//             className="relative pt-[10px] transition-opacity duration-300 ease-in-out before:absolute before:top-[-15px] before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:h-1.5 before:bg-foreground"
//             data-position="50"
//           >
//             50
//           </div>
//           <div
//             className="relative pt-[10px] transition-opacity duration-300 ease-in-out before:absolute before:top-[-15px] before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:h-1.5 before:bg-foreground"
//             data-position="75"
//           >
//             75
//           </div>
//           <div
//             className="relative pt-[10px] transition-opacity duration-300 ease-in-out before:absolute before:top-[-15px] before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:h-1.5 before:bg-foreground"
//             data-position="100"
//           >
//             100
//           </div>
//         </div>
//         {/* Progressive line fills */}
//         <div className="absolute top-0 w-full">
//           <div
//             className="absolute -top-3 left-0 w-1/4 h-[1px] bg-foreground origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
//             id="line-0-25"
//             ref={line0to25Ref}
//           ></div>
//           <div
//             className="absolute -top-3 left-1/4 w-1/4 h-[1px] bg-foreground origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
//             id="line-25-50"
//             ref={line25to50Ref}
//           ></div>
//           <div
//             className="absolute -top-3 left-1/2 w-1/4 h-[1px] bg-foreground origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
//             id="line-50-75"
//             ref={line50to75Ref}
//           ></div>
//           <div
//             className="absolute -top-3 left-0 w-3/4 h-[1px] bg-foreground origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
//             id="line-75-100"
//             ref={line75to100Ref}
//           ></div>
//         </div>
//       </div>

//       {/* Block elements that progressively fill */}
//       <div className="absolute size-full z-10">
//         <div
//           className="absolute bg-blue-500 opacity-25 border border-red-500 origin-center transition-transform duration-600 ease-menu top-1/10 left-1/10 w-[15vw] h-[15vw] "
//           id="block-1"
//           ref={block1Ref}
//         ></div>
//         <div
//           className="absolute bg-blue-500 opacity-25 border border-red-500 origin-center transition-transform duration-600 ease-menu top-1/10 left-1/10 w-[20vw] h-[20vw] "
//           id="block-2"
//           ref={block2Ref}
//         ></div>
//         <div
//           className="absolute bg-blue-500 opacity-25 border border-red-500 origin-center transition-transform duration-600 ease-menu top-1/10 left-1/10 w-[20vw] h-[20vw] "
//           id="block-3"
//           ref={block3Ref}
//         ></div>
//         <div
//           className="absolute bg-blue-500 opacity-25 border border-red-500 origin-center transition-transform duration-600 ease-menu top-1/10 left-1/10 w-[15vw] h-[15vw] "
//           id="block-4"
//           ref={block4Ref}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default Preloader;

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "../utils";

interface PreloaderProps {
  onComplete?: () => void;
}

const MESSAGES = [
  "INITIALIZING",
  "DATA_TRANSFER",
  "COMPILING",
  "FINALIZING",
  "COMPLETE",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const loadersRef = useRef<(() => void)[]>([]);
  const linesRef = useRef<HTMLElement[]>([]);
  const blocksRef = useRef<HTMLElement[]>([]);
  const edgesRef = useRef<{
    top?: HTMLElement;
    bottom?: HTMLElement;
    left?: HTMLElement;
    right?: HTMLElement;
  }>({});
  const isCompletedRef = useRef(false);

  const [progress, setProgress] = useState<number>(0);
  const [displayed, setDisplayed] = useState<number>(0);

  const completeLoading = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const tl = gsap.timeline({
      onComplete: () => onComplete?.(),
    });
    tl.to(el, { y: "-100%", duration: 1, ease: "power2.inOut" }).set(el, {
      display: "none",
    });
  }, [onComplete]);

  // collect resources (images + fonts) and simulate if none
  useEffect(() => {
    let cancelled = false;
    const urls = new Set<string>();

    document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
      if (img.src) urls.add(img.src);
    });

    document
      .querySelectorAll<HTMLElement>("*[style*='background-image']")
      .forEach((el) => {
        const bg = window.getComputedStyle(el).backgroundImage || "";
        const re = /url\(["']?(.+?)["']?\)/g;
        let m;
        while ((m = re.exec(bg))) urls.add(m[1]);
      });

    type DocFonts = { ready: Promise<void>; size?: number } | undefined;
    const docFonts = (document as Document & { fonts?: DocFonts }).fonts;
    const fontPromise: Promise<number> = docFonts?.ready
      ? docFonts.ready.then(() => docFonts.size ?? 1)
      : Promise.resolve(0);

    const imagePromises: Promise<void>[] = [];
    urls.forEach((u) => {
      imagePromises.push(
        new Promise<void>((resolve) => {
          const img = new Image();
          const onDone = () => resolve();
          img.onload = onDone;
          img.onerror = onDone;
          img.src = u;
        })
      );
    });

    const shouldSimulate = urls.size === 0;
    const allPromises = Promise.all([fontPromise, ...imagePromises]);

    if (shouldSimulate) {
      let ticks = 0;
      const total = 10;
      const interval = setInterval(() => {
        ticks += 1;
        setProgress((p) => Math.min(100, Math.round((ticks / total) * 100)));
        if (ticks >= total) clearInterval(interval);
      }, 200);
      loadersRef.current.push(() => clearInterval(interval));
    } else {
      allPromises.then(() => {
        if (cancelled) return;
        const steps = [70, 85, 95, 100];
        steps.forEach((val, idx) => {
          const t = window.setTimeout(() => setProgress(val), 120 * (idx + 1));
          loadersRef.current.push(() => clearTimeout(t));
        });
      });
    }

    return () => {
      cancelled = true;
      loadersRef.current.forEach((fn) => fn());
      loadersRef.current = [];
    };
  }, []);

  // // cache DOM refs for lines/blocks/edges once when container mounts
  // useEffect(() => {
  //   const c = containerRef.current;
  //   if (!c) return;
  //   linesRef.current = Array.from(
  //     c.querySelectorAll<HTMLElement>("[data-line]")
  //   );
  //   blocksRef.current = Array.from(
  //     c.querySelectorAll<HTMLElement>("[data-block]")
  //   );
  //   edgesRef.current.top =
  //     c.querySelector<HTMLElement>("[data-top]") || undefined;
  //   edgesRef.current.bottom =
  //     c.querySelector<HTMLElement>("[data-bottom]") || undefined;
  //   edgesRef.current.left =
  //     c.querySelector<HTMLElement>("[data-left]") || undefined;
  //   edgesRef.current.right =
  //     c.querySelector<HTMLElement>("[data-right]") || undefined;

  //   // ensure every line has transform-origin left so CSS transitions behave predictably
  //   linesRef.current.forEach((el) => {
  //     el.style.transformOrigin = "left center";
  //     // remove Tailwind scale class if present by forcing initial inline transform
  //     el.style.transform = "scaleX(0)";
  //     // keep CSS transition from the class; inline transform will animate with it
  //   });

  //   // ensure blocks have initial transform scale(0)
  //   blocksRef.current.forEach((el) => {
  //     el.style.transformOrigin = "center center";
  //     el.style.transform = "scale(0)";
  //   });
  // }, []);

  // drive visual updates and completion side-effects whenever progress changes
  useEffect(() => {
    // update progress bar width
    if (progressBarRef.current)
      progressBarRef.current.style.width = `${progress}%`;

    // update the 4 quarter lines: they map to ranges 0-25,25-50,50-75,75-100
    // each line's internal fraction = clamp((progress - start) / 25, 0, 1)
    const ranges = [0, 25, 50, 75];
    ranges.forEach((start, idx) => {
      const el = linesRef.current[idx];
      if (!el) return;
      const frac = Math.min(1, Math.max(0, (progress - start) / 25));
      // set inline transform; CSS transition will animate transform smoothly
      el.style.transform = `scaleX(${frac})`;
    });

    // update blocks with thresholds at 20,40,60,80
    [20, 40, 60, 80].forEach((threshold, idx) => {
      const el = blocksRef.current[idx];
      if (!el) return;
      const scale =
        progress > threshold ? Math.min(1, (progress - threshold) / 20) : 0;
      el.style.transform = `scale(${scale})`;
    });

    // edges
    if (edgesRef.current.top) edgesRef.current.top.style.width = `${progress}%`;
    if (edgesRef.current.bottom)
      edgesRef.current.bottom.style.width = `${progress}%`;
    if (edgesRef.current.left)
      edgesRef.current.left.style.height = `${progress}%`;
    if (edgesRef.current.right)
      edgesRef.current.right.style.height = `${progress}%`;

    // complete
    if (progress >= 100 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      const t = window.setTimeout(() => completeLoading(), 800);
      loadersRef.current.push(() => clearTimeout(t));
    }
  }, [progress, completeLoading]);

  // single RAF loop to smoothly animate numeric display toward progress
  useEffect(() => {
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;

      setDisplayed((prev) => {
        if (prev === progress) return prev;
        const gap = progress - prev;
        // time-based easing for consistency across frame rates
        const step = Math.max(1, Math.round(gap * 0.12));
        return Math.min(progress, prev + step);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [progress]);

  const messageIndex = Math.min(MESSAGES.length - 1, Math.floor(progress / 20));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex flex-col overflow-hidden bg-background dark:bg-foreground"
    >
      {/* Pixel grid elements */}
      <div className="absolute inset-0 z-0">
        <div
          data-top
          className="absolute bg-brand-800 h-px w-0 left-0 transition-[width] duration-300 top-1/5"
        />
        <div
          data-bottom
          className="absolute bg-brand-800 h-px w-0 left-0 transition-[width] duration-300 bottom-1/5"
        />
        <div
          data-left
          className="absolute bg-brand-800 w-px h-0 top-0 transition-[height] duration-300 left-1/5"
        />
        <div
          data-right
          className="absolute bg-brand-800 w-px h-0 top-0 transition-[height] duration-300 right-1/5"
        />
      </div>

      {/* Counter */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] w-full text-center">
        <div className="text-[clamp(8rem,20vw,20rem)] font-bold leading-[0.8] text-foreground relative inline-block font-mono">
          {displayed}
        </div>
        <div
          className="text-[clamp(8rem,20vw,20rem)] font-bold leading-[0.8] text-transparent text-stroke-1 text-stroke-brand-800 absolute top-2 left-2 size-full -z-10 font-mono pointer-events-none"
          aria-hidden={true}
        >
          {displayed}
        </div>
      </div>

      {/* Status */}
      <div className="absolute top-8 left-8 z-10">
        <div className="text-3xl font-bold mb-4 opacity-90 font-mono text-foreground">
          LOADING SYSTEM
        </div>
        <div className="text-base font-normal leading-[1.5] opacity-60 h-[1.5em] overflow-hidden font-mono text-foreground">
          <div>{MESSAGES[messageIndex]}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="absolute bottom-12 left-8 right-8 z-10">
        <div className="h-1 w-full bg-foreground/10 mb-[10px] relative">
          <div
            ref={progressBarRef}
            className="h-full w-0 bg-foreground transition-[width] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
          />
        </div>

        <div className="flex justify-between w-full text-xs opacity-60 relative font-mono text-foreground">
          {[0, 25, 50, 75, 100].map((val) => (
            <div key={val} className="relative pt-[10px]" data-position={val}>
              {val}
            </div>
          ))}
        </div>

        <div className="absolute top-0 w-full">
          {/* NOTE: removed Tailwind scale-x-0 to avoid transform conflicts; inline transform controls scale */}
          {[0, 25, 50, 75].map((val, i) => {
            return (
              <div
                key={i}
                data-line={`${val}-${val + 25}`}
                className="absolute -top-5 left-0 w-1/4 h-3 bg-foreground origin-left transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
              />
            );
          })}
        </div>
      </div>

      {/* Blocks */}
      <div className="absolute inset-0 z-10">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            data-block={i}
            className={cn(
              "absolute bg-brand-700 border scale-0 border-brand-800/40 origin-center transition-transform duration-600 ease-menu w-[15vw] h-[15vw]",
              i === 1 && "top-1/10 left-1/10",
              i === 2 && "top-1/10 right-1/10",
              i === 3 && "bottom-1/10 left-1/10",
              i === 4 && "bottom-1/10 right-1/10"
            )}
          />
        ))}
      </div>
    </div>
  );
}
