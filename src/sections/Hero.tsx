// // import { useGSAP } from "@gsap/react";
// // import ModernArrow from "../components/ModernArrow";
// // import AsteriskCircleAnimated from "../components/ui/AsteriskCircleAnimated";
// // import gsap from "gsap";
// // import { useRef } from "react";
// // import IconArrowRight from "../components/icons/ArrowRight";
// // import Gallery from "../components/Gallery";

// // const Hero = () => {
// //   const marqueeRef = useRef<HTMLDivElement>(null);
// //   const videoMarqueeRef = useRef<HTMLDivElement>(null);

// //   const testimonialContainerRef = useRef<HTMLDivElement>(null);
// //   const ariRef = useRef<HTMLAnchorElement>(null);
// //   const dennisRef = useRef<HTMLAnchorElement>(null);
// //   const tlRef = useRef<gsap.core.Timeline | null>(null);

// //   useGSAP(() => {
// //     const arrowTl = gsap.timeline({
// //       repeat: -1,
// //       repeatDelay: 0.3,
// //     });

// //     const xPercent = 120;

// //     arrowTl.fromTo(
// //       ".hero-modern-arrow",
// //       {
// //         x: -xPercent,
// //         opacity: 0,
// //       },
// //       {
// //         x: 0,
// //         opacity: 1,
// //         duration: 1.2,
// //         ease: "power2.out",
// //       }
// //     );

// //     arrowTl.to(".hero-modern-arrow", {
// //       x: xPercent,
// //       opacity: 0,
// //       duration: 1.2,
// //       ease: "power2.in",
// //     });
// //     arrowTl.to(".hero-modern-arrow", {
// //       rotate: 180,
// //       duration: 1.2,
// //       ease: "power2.in",
// //     });

// //     arrowTl.fromTo(
// //       ".hero-modern-arrow",
// //       {
// //         x: xPercent,
// //         opacity: 0,
// //       },
// //       {
// //         x: 0,
// //         opacity: 1,
// //         duration: 1.2,
// //         ease: "power2.out",
// //       }
// //     );

// //     arrowTl.to(".hero-modern-arrow", {
// //       x: -xPercent,
// //       opacity: 0,
// //       duration: 1.2,
// //       ease: "power2.in",
// //     });
// //     arrowTl.to(".hero-modern-arrow", {
// //       rotate: 0,
// //       duration: 1.2,
// //       ease: "power2.in",
// //     });

// //     // Fix for the marquee animation
// //     if (!marqueeRef.current) return;

// //     // Create a seamless infinite animation
// //     const marqueeItems = marqueeRef.current.querySelectorAll(".marquee-item");

// //     // First, duplicate all items for a seamless loop
// //     const originalItems = Array.from(marqueeItems);
// //     originalItems.forEach((item) => {
// //       const clone = item.cloneNode(true);
// //       marqueeRef.current?.appendChild(clone);
// //     });

// //     // Calculate the total width of the original items
// //     let totalWidth = 0;
// //     originalItems.forEach((item) => {
// //       const el = item as HTMLElement;
// //       const style = window.getComputedStyle(el);
// //       const width = el.offsetWidth;
// //       const marginRight = parseInt(style.marginRight) || 0;
// //       totalWidth += width + marginRight;
// //     });

// //     // Create the animation
// //     gsap.to(marqueeRef.current, {
// //       x: -totalWidth,
// //       duration: totalWidth / 100, // Adjust speed (higher divisor = faster)
// //       repeat: -1,
// //       ease: "none", // Use "none" instead of Linear.easeNone
// //       repeatRefresh: true, // Important for smooth looping
// //     });

// //     if (
// //       !ariRef.current ||
// //       !dennisRef.current ||
// //       !testimonialContainerRef.current
// //     )
// //       return;

// //     const ari = ariRef.current;
// //     const dennis = dennisRef.current;

// //     // Set initial states
// //     gsap.set(ari, { position: "absolute", top: "-3.8em", zIndex: 1, scale: 1 });
// //     gsap.set(dennis, {
// //       position: "absolute",
// //       top: "-1.7em",
// //       zIndex: 0,
// //       scale: 0.9,
// //     });

// //     // Create timeline
// //     const tl = gsap.timeline({ repeat: -1, paused: false });
// //     tlRef.current = tl;

// //     tl.to({}, { duration: 4 });

// //     tl.to(
// //       ari,
// //       { top: "-5.8em", scale: 0.95, duration: 0.7, ease: "power3.in" },
// //       "transizione1"
// //     );
// //     tl.to(
// //       dennis,
// //       { top: "0.1em", scale: 0.95, duration: 0.7, ease: "power3.in" },
// //       "transizione1"
// //     );

// //     tl.add(() => {
// //       gsap.set(ari, { zIndex: 0 });
// //       gsap.set(dennis, { zIndex: 1 });
// //     });

// //     tl.to(
// //       ari,
// //       { top: "-1.7em", scale: 0.9, duration: 0.7, ease: "power3.out" },
// //       "transizione2"
// //     );
// //     tl.to(
// //       dennis,
// //       { top: "-3.8em", scale: 1, duration: 0.7, ease: "power3.out" },
// //       "transizione2"
// //     );

// //     tl.to({}, { duration: 4 });

// //     tl.to(
// //       ari,
// //       { top: "0.1em", scale: 0.95, duration: 0.7, ease: "power3.in" },
// //       "transizione3"
// //     );
// //     tl.to(
// //       dennis,
// //       { top: "-5.8em", scale: 0.95, duration: 0.7, ease: "power3.in" },
// //       "transizione3"
// //     );

// //     tl.add(() => {
// //       gsap.set(ari, { zIndex: 1 });
// //       gsap.set(dennis, { zIndex: 0 });
// //     });

// //     tl.to(
// //       ari,
// //       { top: "-3.8em", scale: 1, duration: 0.7, ease: "power3.out" },
// //       "transizione4"
// //     );
// //     tl.to(
// //       dennis,
// //       { top: "-1.7em", scale: 0.9, duration: 0.7, ease: "power3.out" },
// //       "transizione4"
// //     );

// //     // Handle mouse events
// //     const testimonialContainer = testimonialContainerRef.current;

// //     const handleMouseEnter = () => tlRef.current?.pause();
// //     const handleMouseLeave = () => tlRef.current?.play();

// //     testimonialContainer.addEventListener("mouseenter", handleMouseEnter);
// //     testimonialContainer.addEventListener("mouseleave", handleMouseLeave);

// //     // Cleanup
// //     return () => {
// //       testimonialContainer.removeEventListener("mouseenter", handleMouseEnter);
// //       testimonialContainer.removeEventListener("mouseleave", handleMouseLeave);
// //       tlRef.current?.kill();
// //     };
// //   });

// //   return (
// //     <section
// //       className="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-between"
// //       id="home"
// //     >
// //       <div className="flex items-center justify-center grow">
// //         <div className="flex flex-col justify-center text-center space-y-3 pb-24 font-var tracking-wide text-foreground/40 dark:text-background/40 uppercase font-robo">
// //           <div className="text-[2.5vw] font-nippo flex items-center justify-center gap-[4vw] font-medium">
// //             Designer{" "}
// //             <ModernArrow className="hero-modern-arrow w-[3vw] h-max relative dark:text-background text-foreground" />{" "}
// //             Developer
// //           </div>
// //           <h1 className="mt-4 text-[10vw] text-wrap font-medium leading-none tracking-wide">
// //             I <span className="text-foreground dark:text-background">Turn</span>{" "}
// //             Imaginations
// //             <br />
// //             <div className="flex items-center justify-center gap-[4vw] w-full">
// //               Into
// //               <AsteriskCircleAnimated />
// //               <span className="text-foreground dark:text-background">
// //                 Interactive
// //               </span>
// //             </div>
// //             <span className="text-foreground dark:text-background">
// //               Digital
// //             </span>{" "}
// //             Experiences
// //           </h1>
// //         </div>
// //       </div>
// //       <div className="h-50 flex items-center w-full justify-center bg-background dark:bg-foreground border-t-2 border-foreground/10 dark:border-background/10">
// //         {/* First row - left to right */}
// //         <div className="relative flex items-center w-full h-full bg-zinc-800">
// //           <div
// //             ref={marqueeRef}
// //             className="flex items-center gap-8 absolute whitespace-nowrap w-full "
// //           >
// //             <div className="marquee-item px-8 py-4 rounded-xl text-foreground dark:text-background w-[300px]">
// //               <div className="space-y-2">
// //                 <div className="flex items-center gap-2">
// //                   <span
// //                     className={`pill1 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none`}
// //                   >
// //                     Design
// //                   </span>

// //                   <span
// //                     className={`pill1 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none`}
// //                   >
// //                     Development
// //                   </span>

// //                   <span
// //                     className={`pill1 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none`}
// //                   >
// //                     Animation
// //                   </span>
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   <span
// //                     className={`pill1 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none`}
// //                   >
// //                     User Interface
// //                   </span>

// //                   <span
// //                     className={`pill1 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none`}
// //                   >
// //                     GSAP
// //                   </span>

// //                   <span className="pill5 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug transition-all duration-300 cursor-pointer select-none group/arrow relative overflow-hidden hover:border-accent hover:bg-accent min-w-max">
// //                     <span className="relative z-10 inline-flex items-center gap-[0.4vw] group-hover/arrow:gap-[1vw] transition-all duration-300">
// //                       More{" "}
// //                       <IconArrowRight className="w-4 h-4" duotone={false} />
// //                     </span>
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="marquee-item w-[300px] px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background relative">
// //               <div
// //                 className="testimonials_highlights"
// //                 ref={testimonialContainerRef}
// //               >
// //                 <div className="div-block-103">
// //                   <a
// //                     href="#ari_review"
// //                     className="testimonial_hero ari w-inline-block bg-foreground rounded-full border border-background/10"
// //                     ref={ariRef}
// //                   >
// //                     <div className="div-block-100 ari"></div>
// //                     <div className="div-block-101">
// //                       <p className="small_paragraph--tw1 text-balance">
// //                         <span className="quote_mark">“</span>Mika is head and
// //                         shoulders above the crowd, he took my rough design
// //                         ideas...”
// //                       </p>
// //                       <div className="link_cta_container">
// //                         <div className="link_cta">Learn more</div>
// //                         <div className="link_underline"></div>
// //                       </div>
// //                     </div>
// //                   </a>
// //                   <a
// //                     href="#dennis_review"
// //                     className="testimonial_hero dennis w-inline-block bg-foreground rounded-full border border-background/10"
// //                     ref={dennisRef}
// //                   >
// //                     <div className="div-block-100 dennis"></div>
// //                     <div className="div-block-101">
// //                       <p className="small_paragraph--tw1 text-balance">
// //                         <span className="quote_mark">“</span>He brings creative
// //                         ideas to life with precision and care....”
// //                       </p>
// //                       <div className="link_cta_container">
// //                         <div className="link_cta">Learn more</div>
// //                         <div className="link_underline"></div>
// //                       </div>
// //                     </div>
// //                   </a>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="marquee-item px-8 py-4 w-[300px]">
// //               <div className="inline-flex gap-8 items-center">
// //                 <div className="rounded-4xl bg-foreground overflow-hidden h-32 w-86 flex justify-center">
// //                   <div
// //                     ref={videoMarqueeRef}
// //                     className="flex !justify-center !items-center w-96 h-32"
// //                   >
// //                     <Gallery className="w-full h-full flex !justify-center !items-center" />
// //                   </div>
// //                 </div>
// //                 <div className="space-y-1">
// //                   <div className="text-xl font-medium text-background">
// //                     Case Studies
// //                   </div>
// //                   <p className="text-balance text-background/70 text-xs">
// //                     Explore these three distinct case studies to see how I can
// //                     help you.
// //                   </p>
// //                   <a
// //                     href=""
// //                     className="mt-3 flex items-center gap-2 text-sm font-medium text-background transition-colors cursor-pointer w-34 h-8 relative group/cta"
// //                   >
// //                     <span className="rounded-full w-full p-1 ml-0.5 absolute z-10 group-hover/cta:-ml-1.5 group-hover/cta:translate-x-3/4 transition-all duration-300">
// //                       <IconArrowRight className="w-5 h-5" duotone={false} />
// //                     </span>
// //                     <div className="relative ml-12 z-10 group-hover/cta:ml-4 transition-all duration-300">
// //                       Learn more
// //                     </div>
// //                     <div className="absolute left-0 h-full w-8 aspect-square bg-accent z-0 rounded-full group-hover/cta:w-full transition-[width] duration-300"></div>
// //                   </a>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="marquee-item px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background w-[300px]">
// //               React
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Hero;

// import { useGSAP } from "@gsap/react";
// import ModernArrow from "../components/ModernArrow";
// import AsteriskCircleAnimated from "../components/ui/AsteriskCircleAnimated";
// import gsap from "gsap";
// import { useRef, useCallback, memo } from "react";
// import IconArrowRight from "../components/icons/ArrowRight";
// import Gallery from "../components/Gallery";

// // Extracted reusable pill component for better rendering
// const Pill = memo(({ text }: { text: string }) => (
//   <span className="text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none">
//     {text}
//   </span>
// ));

// // Separated testimonial component for better code organization
// const TestimonialItem = memo(
//   ({
//     name,
//     text,
//     href,
//     forwardedRef,
//   }: {
//     name: string;
//     text: string;
//     href: string;
//     forwardedRef: React.Ref<HTMLAnchorElement>;
//   }) => (
//     <a
//       href={href}
//       className={`testimonial_hero ${name} w-inline-block bg-foreground rounded-full border border-background/10`}
//       ref={forwardedRef}
//     >
//       <div className={`div-block-100 ${name}`}></div>
//       <div className="div-block-101">
//         <p className="small_paragraph--tw1 text-balance">
//           <span className="quote_mark">"</span>
//           {text}
//         </p>
//         <div className="link_cta_container">
//           <div className="link_cta">Learn more</div>
//           <div className="link_underline"></div>
//         </div>
//       </div>
//     </a>
//   )
// );

// const Hero = () => {
//   const marqueeRef = useRef<HTMLDivElement>(null);
//   const videoMarqueeRef = useRef<HTMLDivElement>(null);
//   const testimonialContainerRef = useRef<HTMLDivElement>(null);
//   const ariRef = useRef<HTMLAnchorElement>(null);
//   const dennisRef = useRef<HTMLAnchorElement>(null);
//   const tlRef = useRef<gsap.core.Timeline | null>(null);

//   // Memoize event handlers
//   const handleMouseEnter = useCallback(() => tlRef.current?.pause(), []);
//   const handleMouseLeave = useCallback(() => tlRef.current?.play(), []);

//   useGSAP(() => {
//     // Setup arrow animation
//     setupArrowAnimation();

//     // Setup marquee animation
//     setupMarqueeAnimation();

//     // Setup testimonials animation
//     setupTestimonialsAnimation();

//     // Return cleanup function
//     return () => {
//       tlRef.current?.kill();
//       if (testimonialContainerRef.current) {
//         testimonialContainerRef.current.removeEventListener(
//           "mouseenter",
//           handleMouseEnter
//         );
//         testimonialContainerRef.current.removeEventListener(
//           "mouseleave",
//           handleMouseLeave
//         );
//       }
//     };
//   });

//   // Extracted arrow animation for better organization
//   const setupArrowAnimation = () => {
//     const arrowTl = gsap.timeline({
//       repeat: -1,
//       repeatDelay: 0.3,
//     });

//     const xPercent = 120;
//     const animParams = {
//       duration: 1.2,
//       opacity: { from: 0, to: 1 },
//       xFrom: -xPercent,
//       xTo: xPercent,
//     };

//     // Right movement animation
//     arrowTl.fromTo(
//       ".hero-modern-arrow",
//       { x: animParams.xFrom, opacity: animParams.opacity.from },
//       {
//         x: 0,
//         opacity: animParams.opacity.to,
//         duration: animParams.duration,
//         ease: "power2.out",
//       }
//     );
//     arrowTl.to(".hero-modern-arrow", {
//       x: animParams.xTo,
//       opacity: animParams.opacity.from,
//       duration: animParams.duration,
//       ease: "power2.in",
//     });
//     arrowTl.to(".hero-modern-arrow", {
//       rotate: 180,
//       duration: animParams.duration,
//       ease: "power2.in",
//     });

//     // Left movement animation
//     arrowTl.fromTo(
//       ".hero-modern-arrow",
//       { x: animParams.xTo, opacity: animParams.opacity.from },
//       {
//         x: 0,
//         opacity: animParams.opacity.to,
//         duration: animParams.duration,
//         ease: "power2.out",
//       }
//     );
//     arrowTl.to(".hero-modern-arrow", {
//       x: animParams.xFrom,
//       opacity: animParams.opacity.from,
//       duration: animParams.duration,
//       ease: "power2.in",
//     });
//     arrowTl.to(".hero-modern-arrow", {
//       rotate: 0,
//       duration: animParams.duration,
//       ease: "power2.in",
//     });
//   };

//   // Extracted marquee animation for better organization
//   const setupMarqueeAnimation = () => {
//     if (!marqueeRef.current) return;

//     const container = marqueeRef.current;
//     const marqueeItems = container.querySelectorAll(".marquee-item");

//     // Use DocumentFragment for better performance when cloning nodes
//     const fragment = document.createDocumentFragment();
//     const originalItems = Array.from(marqueeItems);
//     originalItems.forEach((item) => {
//       const clone = item.cloneNode(true);
//       fragment.appendChild(clone);
//     });
//     container.appendChild(fragment);

//     // Calculate total width more efficiently
//     let totalWidth = 0;
//     originalItems.forEach((item) => {
//       const el = item as HTMLElement;
//       const style = window.getComputedStyle(el);
//       totalWidth += el.offsetWidth + parseInt(style.marginRight || "0");
//     });

//     // Create the animation with optimized parameters
//     gsap.to(container, {
//       x: -totalWidth,
//       duration: totalWidth / 100,
//       repeat: -1,
//       ease: "none",
//       repeatRefresh: true,
//     });
//   };

//   // Extracted testimonials animation for better organization
//   const setupTestimonialsAnimation = () => {
//     if (
//       !ariRef.current ||
//       !dennisRef.current ||
//       !testimonialContainerRef.current
//     )
//       return;

//     const ari = ariRef.current;
//     const dennis = dennisRef.current;
//     const testimonialContainer = testimonialContainerRef.current;

//     // Common animation parameters
//     const commonParams = {
//       duration: 0.7,
//       ease: {
//         in: "power3.in",
//         out: "power3.out",
//       },
//       positions: {
//         top: "-3.8em",
//         bottom: "-1.7em",
//         exit: "-5.8em",
//         enter: "0.1em",
//       },
//       scales: {
//         active: 1,
//         inactive: 0.9,
//         transition: 0.95,
//       },
//     };

//     // Set initial states
//     gsap.set(ari, {
//       position: "absolute",
//       top: commonParams.positions.top,
//       zIndex: 1,
//       scale: commonParams.scales.active,
//     });
//     gsap.set(dennis, {
//       position: "absolute",
//       top: commonParams.positions.bottom,
//       zIndex: 0,
//       scale: commonParams.scales.inactive,
//     });

//     // Create timeline
//     const tl = gsap.timeline({ repeat: -1, paused: false });
//     tlRef.current = tl;

//     // First phase - hold for 4 seconds
//     tl.to({}, { duration: 4 });

//     // First transition - Ari exits top, Dennis enters from bottom
//     tl.to(
//       ari,
//       {
//         top: commonParams.positions.exit,
//         scale: commonParams.scales.transition,
//         duration: commonParams.duration,
//         ease: commonParams.ease.in,
//       },
//       "transizione1"
//     );
//     tl.to(
//       dennis,
//       {
//         top: commonParams.positions.enter,
//         scale: commonParams.scales.transition,
//         duration: commonParams.duration,
//         ease: commonParams.ease.in,
//       },
//       "transizione1"
//     );

//     // Switch z-indices
//     tl.add(() => {
//       gsap.set(ari, { zIndex: 0 });
//       gsap.set(dennis, { zIndex: 1 });
//     });

//     // Continue transition
//     tl.to(
//       ari,
//       {
//         top: commonParams.positions.bottom,
//         scale: commonParams.scales.inactive,
//         duration: commonParams.duration,
//         ease: commonParams.ease.out,
//       },
//       "transizione2"
//     );
//     tl.to(
//       dennis,
//       {
//         top: commonParams.positions.top,
//         scale: commonParams.scales.active,
//         duration: commonParams.duration,
//         ease: commonParams.ease.out,
//       },
//       "transizione2"
//     );

//     // Second phase - hold for 4 seconds
//     tl.to({}, { duration: 4 });

//     // Third transition - Dennis exits top, Ari enters from bottom
//     tl.to(
//       ari,
//       {
//         top: commonParams.positions.enter,
//         scale: commonParams.scales.transition,
//         duration: commonParams.duration,
//         ease: commonParams.ease.in,
//       },
//       "transizione3"
//     );
//     tl.to(
//       dennis,
//       {
//         top: commonParams.positions.exit,
//         scale: commonParams.scales.transition,
//         duration: commonParams.duration,
//         ease: commonParams.ease.in,
//       },
//       "transizione3"
//     );

//     // Switch z-indices back
//     tl.add(() => {
//       gsap.set(ari, { zIndex: 1 });
//       gsap.set(dennis, { zIndex: 0 });
//     });

//     // Complete cycle
//     tl.to(
//       ari,
//       {
//         top: commonParams.positions.top,
//         scale: commonParams.scales.active,
//         duration: commonParams.duration,
//         ease: commonParams.ease.out,
//       },
//       "transizione4"
//     );
//     tl.to(
//       dennis,
//       {
//         top: commonParams.positions.bottom,
//         scale: commonParams.scales.inactive,
//         duration: commonParams.duration,
//         ease: commonParams.ease.out,
//       },
//       "transizione4"
//     );

//     // Event listeners for mouse interactions
//     testimonialContainer.addEventListener("mouseenter", handleMouseEnter);
//     testimonialContainer.addEventListener("mouseleave", handleMouseLeave);
//   };

//   // Memoized hero title for performance
//   const HeroTitle = memo(() => (
//     <h1 className="mt-4 text-[10vw] text-wrap font-medium leading-none tracking-wide">
//       I <span className="text-foreground dark:text-background">Turn</span>{" "}
//       Imaginations
//       <br />
//       <div className="flex items-center justify-center gap-[4vw] w-full">
//         Into
//         <AsteriskCircleAnimated />
//         <span className="text-foreground dark:text-background">
//           Interactive
//         </span>
//       </div>
//       <span className="text-foreground dark:text-background">Digital</span>{" "}
//       Experiences
//     </h1>
//   ));

//   return (
//     <section
//       className="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-between"
//       id="home"
//     >
//       <div className="flex items-center justify-center grow">
//         <div className="flex flex-col justify-center text-center space-y-3 pb-24 font-var tracking-wide text-foreground/40 dark:text-background/40 uppercase font-robo">
//           <div className="text-[2.5vw] font-nippo flex items-center justify-center gap-[4vw] font-medium">
//             Designer{" "}
//             <ModernArrow className="hero-modern-arrow w-[3vw] h-max relative dark:text-background text-foreground" />{" "}
//             Developer
//           </div>
//           <HeroTitle />
//         </div>
//       </div>

//       <div className="h-50 flex items-center w-full justify-center bg-background dark:bg-foreground border-t-2 border-foreground/10 dark:border-background/10">
//         {/* First row - left to right */}
//         <div className="relative flex items-center w-full h-full bg-zinc-800">
//           <div
//             ref={marqueeRef}
//             className="flex items-center gap-8 absolute whitespace-nowrap w-full"
//           >
//             {/* Pills marquee item */}
//             <div className="marquee-item px-8 py-4 rounded-xl text-foreground dark:text-background w-[300px]">
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Pill text="Design" />
//                   <Pill text="Development" />
//                   <Pill text="Animation" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Pill text="User Interface" />
//                   <Pill text="GSAP" />
//                   <span className="pill5 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug transition-all duration-300 cursor-pointer select-none group/arrow relative overflow-hidden hover:border-accent hover:bg-accent min-w-max">
//                     <span className="relative z-10 inline-flex items-center gap-[0.4vw] group-hover/arrow:gap-[1vw] transition-all duration-300">
//                       More{" "}
//                       <IconArrowRight className="w-4 h-4" duotone={false} />
//                     </span>
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Testimonials marquee item */}
//             <div className="marquee-item w-[300px] px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background relative">
//               <div
//                 className="testimonials_highlights"
//                 ref={testimonialContainerRef}
//               >
//                 <div className="div-block-103">
//                   <TestimonialItem
//                     name="ari"
//                     text="Mika is head and shoulders above the crowd, he took my rough design ideas..."
//                     href="#ari_review"
//                     forwardedRef={ariRef}
//                   />
//                   <TestimonialItem
//                     name="dennis"
//                     text="He brings creative ideas to life with precision and care...."
//                     href="#dennis_review"
//                     forwardedRef={dennisRef}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Gallery marquee item */}
//             <div className="marquee-item px-8 py-4 w-[300px]">
//               <div className="inline-flex gap-8 items-center">
//                 <div className="rounded-4xl bg-foreground overflow-hidden h-32 w-86 flex justify-center">
//                   <div
//                     ref={videoMarqueeRef}
//                     className="flex !justify-center !items-center w-96 h-32"
//                   >
//                     <Gallery className="w-full h-full flex !justify-center !items-center" />
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="text-xl font-medium text-background">
//                     Case Studies
//                   </div>
//                   <p className="text-balance text-background/70 text-xs">
//                     Explore these three distinct case studies to see how I can
//                     help you.
//                   </p>
//                   <a
//                     href="#case-studies"
//                     className="mt-3 flex items-center gap-2 text-sm font-medium text-background transition-colors cursor-pointer w-34 h-8 relative group/cta"
//                   >
//                     <span className="rounded-full w-full p-1 ml-0.5 absolute z-10 group-hover/cta:-ml-1.5 group-hover/cta:translate-x-3/4 transition-all duration-300">
//                       <IconArrowRight className="w-5 h-5" duotone={false} />
//                     </span>
//                     <div className="relative ml-12 z-10 group-hover/cta:ml-4 transition-all duration-300">
//                       Learn more
//                     </div>
//                     <div className="absolute left-0 h-full w-8 aspect-square bg-accent z-0 rounded-full group-hover/cta:w-full transition-[width] duration-300"></div>
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* React marquee item */}
//             <div className="marquee-item px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background w-[300px]">
//               React
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

// import { useGSAP } from "@gsap/react";
// import ModernArrow from "../components/ModernArrow";
// import AsteriskCircleAnimated from "../components/ui/AsteriskCircleAnimated";
// import gsap from "gsap";
// import { useRef, useCallback, memo } from "react";
// import IconArrowRight from "../components/icons/ArrowRight";
// import Gallery from "../components/Gallery";

// // Extracted reusable pill component for better rendering
// const Pill = memo(({ text }: { text: string }) => (
//   <span className="text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none">
//     {text}
//   </span>
// ));

// // Separated testimonial component for better code organization
// const TestimonialItem = memo(
//   ({
//     name,
//     text,
//     href,
//     forwardedRef,
//   }: {
//     name: string;
//     text: string;
//     href: string;
//     forwardedRef: React.Ref<HTMLAnchorElement>;
//   }) => (
//     <a
//       href={href}
//       className={`testimonial_hero ${name} w-inline-block bg-foreground rounded-full border border-background/10`}
//       ref={forwardedRef}
//     >
//       <div className={`div-block-100 ${name}`}></div>
//       <div className="div-block-101">
//         <p className="small_paragraph--tw1 text-balance">
//           <span className="quote_mark">"</span>
//           {text}
//         </p>
//         <div className="link_cta_container">
//           <div className="link_cta">Learn more</div>
//           <div className="link_underline"></div>
//         </div>
//       </div>
//     </a>
//   )
// );

// // Skills Pills Marquee Item Component
// const PillsMarqueeItem = memo(() => (
//   <div className="marquee-item px-8 py-4 rounded-xl text-foreground dark:text-background w-[300px]">
//     <div className="space-y-2">
//       <div className="flex items-center gap-2">
//         <Pill text="Design" />
//         <Pill text="Development" />
//         <Pill text="Animation" />
//       </div>
//       <div className="flex items-center gap-2">
//         <Pill text="User Interface" />
//         <Pill text="GSAP" />
//         <span className="pill5 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug transition-all duration-300 cursor-pointer select-none group/arrow relative overflow-hidden hover:border-accent hover:bg-accent min-w-max">
//           <span className="relative z-10 inline-flex items-center gap-[0.4vw] group-hover/arrow:gap-[1vw] transition-all duration-300">
//             More <IconArrowRight className="w-4 h-4" duotone={false} />
//           </span>
//         </span>
//       </div>
//     </div>
//   </div>
// ));

// // Testimonials Marquee Item Component
// const TestimonialsMarqueeItem = memo(
//   ({
//     testimonialContainerRef,
//     ariRef,
//     dennisRef,
//   }: {
//     // Change these types from RefObject to Ref
//     testimonialContainerRef: React.Ref<HTMLDivElement>;
//     ariRef: React.Ref<HTMLAnchorElement>;
//     dennisRef: React.Ref<HTMLAnchorElement>;
//   }) => (
//     <div className="marquee-item w-[300px] px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background relative">
//       <div className="testimonials_highlights" ref={testimonialContainerRef}>
//         <div className="div-block-103">
//           <TestimonialItem
//             name="ari"
//             text="Mika is head and shoulders above the crowd, he took my rough design ideas..."
//             href="#ari_review"
//             forwardedRef={ariRef}
//           />
//           <TestimonialItem
//             name="dennis"
//             text="He brings creative ideas to life with precision and care...."
//             href="#dennis_review"
//             forwardedRef={dennisRef}
//           />
//         </div>
//       </div>
//     </div>
//   )
// );

// // Also fix the GalleryMarqueeItem component
// const GalleryMarqueeItem = memo(
//   ({
//     videoMarqueeRef,
//   }: {
//     // Change this type as well
//     videoMarqueeRef: React.Ref<HTMLDivElement>;
//   }) => (
//     <div className="marquee-item px-8 py-4 w-[300px]">
//       <div className="inline-flex gap-8 items-center">
//         <div className="rounded-4xl bg-foreground overflow-hidden h-32 w-86 flex justify-center">
//           <div
//             ref={videoMarqueeRef}
//             className="flex !justify-center !items-center w-96 h-32"
//           >
//             <Gallery className="w-full h-full flex !justify-center !items-center" />
//           </div>
//         </div>
//         <div className="space-y-1">
//           <div className="text-xl font-medium text-background">
//             Case Studies
//           </div>
//           <p className="text-balance text-background/70 text-xs">
//             Explore these three distinct case studies to see how I can help you.
//           </p>
//           <a
//             href="#case-studies"
//             className="mt-3 flex items-center gap-2 text-sm font-medium text-background transition-colors cursor-pointer w-34 h-8 relative group/cta"
//           >
//             <span className="rounded-full w-full p-1 ml-0.5 absolute z-10 group-hover/cta:-ml-1.5 group-hover/cta:translate-x-3/4 transition-all duration-300">
//               <IconArrowRight className="w-5 h-5" duotone={false} />
//             </span>
//             <div className="relative ml-12 z-10 group-hover/cta:ml-4 transition-all duration-300">
//               Learn more
//             </div>
//             <div className="absolute left-0 h-full w-8 aspect-square bg-accent z-0 rounded-full group-hover/cta:w-full transition-[width] duration-300"></div>
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// );

// // React Marquee Item Component
// const ReactMarqueeItem = memo(() => (
//   <div className="marquee-item px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background w-[300px]">
//     React
//   </div>
// ));

// // Memoized Hero Title Component
// const HeroTitle = memo(() => (
//   <h1 className="mt-4 text-[10vw] text-wrap font-medium leading-none tracking-wide">
//     I <span className="text-foreground dark:text-background">Turn</span>{" "}
//     Imaginations
//     <br />
//     <div className="flex items-center justify-center gap-[4vw] w-full">
//       Into
//       <AsteriskCircleAnimated />
//       <span className="text-foreground dark:text-background">Interactive</span>
//     </div>
//     <span className="text-foreground dark:text-background">Digital</span>{" "}
//     Experiences
//   </h1>
// ));

// const Hero = () => {
//   const marqueeRef = useRef<HTMLDivElement>(null);
//   const videoMarqueeRef = useRef<HTMLDivElement>(null);
//   const testimonialContainerRef = useRef<HTMLDivElement>(null);
//   const ariRef = useRef<HTMLAnchorElement>(null);
//   const dennisRef = useRef<HTMLAnchorElement>(null);
//   const tlRef = useRef<gsap.core.Timeline | null>(null);

//   // Memoize event handlers
//   const handleMouseEnter = useCallback(() => tlRef.current?.pause(), []);
//   const handleMouseLeave = useCallback(() => tlRef.current?.play(), []);

//   useGSAP(() => {
//     // Setup arrow animation
//     setupArrowAnimation();

//     // Setup marquee animation
//     setupMarqueeAnimation();

//     // Setup testimonials animation
//     setupTestimonialsAnimation();

//     // Return cleanup function
//     return () => {
//       tlRef.current?.kill();
//       if (testimonialContainerRef.current) {
//         testimonialContainerRef.current.removeEventListener(
//           "mouseenter",
//           handleMouseEnter
//         );
//         testimonialContainerRef.current.removeEventListener(
//           "mouseleave",
//           handleMouseLeave
//         );
//       }
//     };
//   });

//   // Extracted arrow animation for better organization
//   const setupArrowAnimation = () => {
//     const arrowTl = gsap.timeline({
//       repeat: -1,
//       repeatDelay: 0.3,
//     });

//     const xPercent = 120;
//     const animParams = {
//       duration: 1.2,
//       opacity: { from: 0, to: 1 },
//       xFrom: -xPercent,
//       xTo: xPercent,
//     };

//     // Right movement animation
//     arrowTl.fromTo(
//       ".hero-modern-arrow",
//       { x: animParams.xFrom, opacity: animParams.opacity.from },
//       {
//         x: 0,
//         opacity: animParams.opacity.to,
//         duration: animParams.duration,
//         ease: "power2.out",
//       }
//     );
//     arrowTl.to(".hero-modern-arrow", {
//       x: animParams.xTo,
//       opacity: animParams.opacity.from,
//       duration: animParams.duration,
//       ease: "power2.in",
//     });
//     arrowTl.to(".hero-modern-arrow", {
//       rotate: 180,
//       duration: animParams.duration,
//       ease: "power2.in",
//     });

//     // Left movement animation
//     arrowTl.fromTo(
//       ".hero-modern-arrow",
//       { x: animParams.xTo, opacity: animParams.opacity.from },
//       {
//         x: 0,
//         opacity: animParams.opacity.to,
//         duration: animParams.duration,
//         ease: "power2.out",
//       }
//     );
//     arrowTl.to(".hero-modern-arrow", {
//       x: animParams.xFrom,
//       opacity: animParams.opacity.from,
//       duration: animParams.duration,
//       ease: "power2.in",
//     });
//     arrowTl.to(".hero-modern-arrow", {
//       rotate: 0,
//       duration: animParams.duration,
//       ease: "power2.in",
//     });
//   };

//   // Extracted marquee animation for better organization
//   const setupMarqueeAnimation = () => {
//     if (!marqueeRef.current) return;

//     const container = marqueeRef.current;
//     const marqueeItems = container.querySelectorAll(".marquee-item");

//     // Clear any existing clones first to avoid duplication
//     const existingClones = container.querySelectorAll(".marquee-clone");
//     existingClones.forEach((clone) => clone.remove());

//     // Use DocumentFragment for better performance when cloning nodes
//     const fragment = document.createDocumentFragment();
//     const originalItems = Array.from(marqueeItems);
//     originalItems.forEach((item) => {
//       const clone = item.cloneNode(true) as HTMLElement;
//       clone.classList.add("marquee-clone");
//       fragment.appendChild(clone);
//     });
//     container.appendChild(fragment);

//     // Calculate total width more efficiently
//     let totalWidth = 0;
//     originalItems.forEach((item) => {
//       const el = item as HTMLElement;
//       const style = window.getComputedStyle(el);
//       totalWidth += el.offsetWidth + parseInt(style.marginRight || "0");
//     });

//     // Kill any existing animation to prevent conflicts
//     gsap.killTweensOf(container);

//     // Create the animation with optimized parameters
//     gsap.to(container, {
//       x: -totalWidth,
//       duration: totalWidth / 100,
//       repeat: -1,
//       ease: "none",
//       repeatRefresh: true,
//       onRepeat: function () {
//         // Reset position for perfect looping
//         gsap.set(container, { x: 0 });
//       },
//     });
//   };

//   // Extracted testimonials animation for better organization
//   const setupTestimonialsAnimation = () => {
//     if (
//       !ariRef.current ||
//       !dennisRef.current ||
//       !testimonialContainerRef.current
//     )
//       return;

//     const ari = ariRef.current;
//     const dennis = dennisRef.current;
//     const testimonialContainer = testimonialContainerRef.current;

//     // Common animation parameters
//     const commonParams = {
//       duration: 0.7,
//       ease: {
//         in: "power3.in",
//         out: "power3.out",
//       },
//       positions: {
//         top: "-3.8em",
//         bottom: "-1.7em",
//         exit: "-5.8em",
//         enter: "0.1em",
//       },
//       scales: {
//         active: 1,
//         inactive: 0.9,
//         transition: 0.95,
//       },
//     };

//     // Set initial states
//     gsap.set(ari, {
//       position: "absolute",
//       top: commonParams.positions.top,
//       zIndex: 1,
//       scale: commonParams.scales.active,
//     });
//     gsap.set(dennis, {
//       position: "absolute",
//       top: commonParams.positions.bottom,
//       zIndex: 0,
//       scale: commonParams.scales.inactive,
//     });

//     // Create timeline
//     const tl = gsap.timeline({ repeat: -1, paused: false });
//     tlRef.current = tl;

//     // First phase - hold for 4 seconds
//     tl.to({}, { duration: 4 });

//     // First transition - Ari exits top, Dennis enters from bottom
//     tl.to(
//       ari,
//       {
//         top: commonParams.positions.exit,
//         scale: commonParams.scales.transition,
//         duration: commonParams.duration,
//         ease: commonParams.ease.in,
//       },
//       "transizione1"
//     );
//     tl.to(
//       dennis,
//       {
//         top: commonParams.positions.enter,
//         scale: commonParams.scales.transition,
//         duration: commonParams.duration,
//         ease: commonParams.ease.in,
//       },
//       "transizione1"
//     );

//     // Switch z-indices
//     tl.add(() => {
//       gsap.set(ari, { zIndex: 0 });
//       gsap.set(dennis, { zIndex: 1 });
//     });

//     // Continue transition
//     tl.to(
//       ari,
//       {
//         top: commonParams.positions.bottom,
//         scale: commonParams.scales.inactive,
//         duration: commonParams.duration,
//         ease: commonParams.ease.out,
//       },
//       "transizione2"
//     );
//     tl.to(
//       dennis,
//       {
//         top: commonParams.positions.top,
//         scale: commonParams.scales.active,
//         duration: commonParams.duration,
//         ease: commonParams.ease.out,
//       },
//       "transizione2"
//     );

//     // Second phase - hold for 4 seconds
//     tl.to({}, { duration: 4 });

//     // Third transition - Dennis exits top, Ari enters from bottom
//     tl.to(
//       ari,
//       {
//         top: commonParams.positions.enter,
//         scale: commonParams.scales.transition,
//         duration: commonParams.duration,
//         ease: commonParams.ease.in,
//       },
//       "transizione3"
//     );
//     tl.to(
//       dennis,
//       {
//         top: commonParams.positions.exit,
//         scale: commonParams.scales.transition,
//         duration: commonParams.duration,
//         ease: commonParams.ease.in,
//       },
//       "transizione3"
//     );

//     // Switch z-indices back
//     tl.add(() => {
//       gsap.set(ari, { zIndex: 1 });
//       gsap.set(dennis, { zIndex: 0 });
//     });

//     // Complete cycle
//     tl.to(
//       ari,
//       {
//         top: commonParams.positions.top,
//         scale: commonParams.scales.active,
//         duration: commonParams.duration,
//         ease: commonParams.ease.out,
//       },
//       "transizione4"
//     );
//     tl.to(
//       dennis,
//       {
//         top: commonParams.positions.bottom,
//         scale: commonParams.scales.inactive,
//         duration: commonParams.duration,
//         ease: commonParams.ease.out,
//       },
//       "transizione4"
//     );

//     // Event listeners for mouse interactions
//     testimonialContainer.addEventListener("mouseenter", handleMouseEnter);
//     testimonialContainer.addEventListener("mouseleave", handleMouseLeave);
//   };

//   return (
//     <section
//       className="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-between"
//       id="home"
//     >
//       <div className="flex items-center justify-center grow">
//         <div className="flex flex-col justify-center text-center space-y-3 pb-24 font-var tracking-wide text-foreground/40 dark:text-background/40 uppercase font-robo">
//           <div className="text-[2.5vw] font-nippo flex items-center justify-center gap-[4vw] font-medium">
//             Designer{" "}
//             <ModernArrow className="hero-modern-arrow w-[3vw] h-max relative dark:text-background text-foreground" />{" "}
//             Developer
//           </div>
//           <HeroTitle />
//         </div>
//       </div>

//       <div className="h-50 flex items-center w-full justify-center bg-background dark:bg-foreground border-t-2 border-foreground/10 dark:border-background/10">
//         {/* First row - left to right */}
//         <div className="relative flex items-center w-full h-full bg-zinc-800 overflow-hidden">
//           <div
//             ref={marqueeRef}
//             className="flex items-center gap-8 absolute whitespace-nowrap w-full"
//           >
//             {/* Separate component for each marquee item */}
//             <PillsMarqueeItem />
//             <TestimonialsMarqueeItem
//               testimonialContainerRef={testimonialContainerRef}
//               ariRef={ariRef}
//               dennisRef={dennisRef}
//             />
//             <GalleryMarqueeItem videoMarqueeRef={videoMarqueeRef} />
//             <ReactMarqueeItem />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import { useGSAP } from "@gsap/react";
import ModernArrow from "../components/ModernArrow";
import AsteriskCircleAnimated from "../components/ui/AsteriskCircleAnimated";
import gsap from "gsap";
import { useRef, useCallback, memo, useEffect, useState } from "react";
import IconArrowRight from "../components/icons/ArrowRight";
import Gallery from "../components/Gallery";

// Extracted reusable pill component for better rendering
const Pill = memo(({ text }: { text: string }) => (
  <span className="text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug pointer-events-none select-none">
    {text}
  </span>
));

// Animated ModernArrow component that handles its own animation
const AnimatedArrow = memo(() => {
  useGSAP(() => {
    const xPercent = 120;
    const animParams = {
      duration: 1.2,
      opacity: { from: 0, to: 1 },
      xFrom: -xPercent,
      xTo: xPercent,
    };

    const arrowTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.3,
    });

    // Right movement animation
    arrowTl.fromTo(
      ".hero-modern-arrow",
      { x: animParams.xFrom, opacity: animParams.opacity.from },
      {
        x: 0,
        opacity: animParams.opacity.to,
        duration: animParams.duration,
        ease: "power2.out",
      }
    );
    arrowTl.to(".hero-modern-arrow", {
      x: animParams.xTo,
      opacity: animParams.opacity.from,
      duration: animParams.duration,
      ease: "power2.in",
    });
    arrowTl.to(".hero-modern-arrow", {
      rotate: 180,
      duration: animParams.duration,
      ease: "power2.in",
    });

    // Left movement animation
    arrowTl.fromTo(
      ".hero-modern-arrow",
      { x: animParams.xTo, opacity: animParams.opacity.from },
      {
        x: 0,
        opacity: animParams.opacity.to,
        duration: animParams.duration,
        ease: "power2.out",
      }
    );
    arrowTl.to(".hero-modern-arrow", {
      x: animParams.xFrom,
      opacity: animParams.opacity.from,
      duration: animParams.duration,
      ease: "power2.in",
    });
    arrowTl.to(".hero-modern-arrow", {
      rotate: 0,
      duration: animParams.duration,
      ease: "power2.in",
    });

    return () => {
      arrowTl.kill();
    };
  });

  return (
    <ModernArrow className="hero-modern-arrow w-[3vw] h-max relative dark:text-background text-foreground" />
  );
});

// Marquee container component that handles its own animation
const MarqueeContainer = memo(({ children }: { children: React.ReactNode }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!marqueeRef.current) return;

    const container = marqueeRef.current;
    const marqueeItems = container.querySelectorAll(".marquee-item");

    // Clear any existing clones first to avoid duplication
    const existingClones = container.querySelectorAll(".marquee-clone");
    existingClones.forEach((clone) => clone.remove());

    // Use DocumentFragment for better performance when cloning nodes
    const fragment = document.createDocumentFragment();
    const originalItems = Array.from(marqueeItems);
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.classList.add("marquee-clone");
      fragment.appendChild(clone);
    });
    container.appendChild(fragment);

    // Calculate total width more efficiently
    let totalWidth = 0;
    originalItems.forEach((item) => {
      const el = item as HTMLElement;
      const style = window.getComputedStyle(el);
      totalWidth += el.offsetWidth + parseInt(style.marginRight || "0");
    });

    // Kill any existing animation to prevent conflicts
    gsap.killTweensOf(container);

    // Fix this in the useGSAP hook
    const marqueeAnimation = gsap.to(container, {
      x: -totalWidth,
      duration: totalWidth / 100,
      repeat: -1,
      ease: "none",
      repeatRefresh: true,
      onRepeat: function () {
        // Use a block statement to avoid returning the Tween
        gsap.set(container, { x: 0 });
        // Don't return anything (void)
      },
    });

    // Create a check to ensure animation keeps running
    const keepAliveInterval = setInterval(() => {
      if (!marqueeAnimation.isActive()) {
        marqueeAnimation.restart(true);
      }
    }, 3000);

    // Clean up
    return () => {
      clearInterval(keepAliveInterval);
      marqueeAnimation.kill();
    };
  }, []);

  // Handle visibility changes to restart animation when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && marqueeRef.current) {
        gsap.killTweensOf(marqueeRef.current);
        const items = marqueeRef.current.querySelectorAll(".marquee-item");
        if (items.length > 0) {
          const totalWidth = Array.from(items).reduce((width, item) => {
            const el = item as HTMLElement;
            const style = window.getComputedStyle(el);
            return width + el.offsetWidth + parseInt(style.marginRight || "0");
          }, 0);

          gsap.to(marqueeRef.current, {
            x: -totalWidth,
            duration: totalWidth / 100,
            repeat: -1,
            ease: "none",
            repeatRefresh: true,
            onRepeat: () => {
              // Use a block statement to avoid returning the Tween
              gsap.set(marqueeRef.current, { x: 0 });
              // Don't return anything (void)
            },
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="flex items-center gap-8 absolute whitespace-nowrap w-full"
    >
      {children}
    </div>
  );
});

// Testimonial item component for better code organization
const TestimonialItem = memo(
  ({
    name,
    text,
    href,
    forwardedRef,
  }: {
    name: string;
    text: string;
    href: string;
    forwardedRef: React.Ref<HTMLAnchorElement>;
  }) => (
    <a
      href={href}
      className={`testimonial_hero ${name} w-inline-block bg-foreground rounded-full border border-background/10`}
      ref={forwardedRef}
    >
      <div className={`div-block-100 ${name}`}></div>
      <div className="div-block-101">
        <p className="small_paragraph--tw1 text-balance">
          <span className="quote_mark">"</span>
          {text}
        </p>
        <div className="link_cta_container">
          <div className="link_cta">Learn more</div>
          <div className="link_underline"></div>
        </div>
      </div>
    </a>
  )
);

// Self-contained Testimonials component with its own animation
const TestimonialsMarqueeItem = memo(() => {
  const testimonialContainerRef = useRef<HTMLDivElement>(null);
  const ariRef = useRef<HTMLAnchorElement>(null);
  const dennisRef = useRef<HTMLAnchorElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Memoize event handlers
  const handleMouseEnter = useCallback(() => tlRef.current?.pause(), []);
  const handleMouseLeave = useCallback(() => tlRef.current?.play(), []);

  useGSAP(() => {
    if (
      !ariRef.current ||
      !dennisRef.current ||
      !testimonialContainerRef.current
    )
      return;

    const ari = ariRef.current;
    const dennis = dennisRef.current;
    const testimonialContainer = testimonialContainerRef.current;

    // Common animation parameters
    const commonParams = {
      duration: 0.7,
      ease: {
        in: "power3.in",
        out: "power3.out",
      },
      positions: {
        top: "-3.8em",
        bottom: "-1.7em",
        exit: "-5.8em",
        enter: "0.1em",
      },
      scales: {
        active: 1,
        inactive: 0.9,
        transition: 0.95,
      },
    };

    // Set initial states
    gsap.set(ari, {
      position: "absolute",
      top: commonParams.positions.top,
      zIndex: 1,
      scale: commonParams.scales.active,
    });
    gsap.set(dennis, {
      position: "absolute",
      top: commonParams.positions.bottom,
      zIndex: 0,
      scale: commonParams.scales.inactive,
    });

    // Create timeline
    const tl = gsap.timeline({ repeat: -1, paused: false });
    tlRef.current = tl;

    // First phase - hold for 4 seconds
    tl.to({}, { duration: 4 });

    // First transition - Ari exits top, Dennis enters from bottom
    tl.to(
      ari,
      {
        top: commonParams.positions.exit,
        scale: commonParams.scales.transition,
        duration: commonParams.duration,
        ease: commonParams.ease.in,
      },
      "transizione1"
    );
    tl.to(
      dennis,
      {
        top: commonParams.positions.enter,
        scale: commonParams.scales.transition,
        duration: commonParams.duration,
        ease: commonParams.ease.in,
      },
      "transizione1"
    );

    // Switch z-indices
    tl.add(() => {
      gsap.set(ari, { zIndex: 0 });
      gsap.set(dennis, { zIndex: 1 });
    });

    // Continue transition
    tl.to(
      ari,
      {
        top: commonParams.positions.bottom,
        scale: commonParams.scales.inactive,
        duration: commonParams.duration,
        ease: commonParams.ease.out,
      },
      "transizione2"
    );
    tl.to(
      dennis,
      {
        top: commonParams.positions.top,
        scale: commonParams.scales.active,
        duration: commonParams.duration,
        ease: commonParams.ease.out,
      },
      "transizione2"
    );

    // Second phase - hold for 4 seconds
    tl.to({}, { duration: 4 });

    // Third transition - Dennis exits top, Ari enters from bottom
    tl.to(
      ari,
      {
        top: commonParams.positions.enter,
        scale: commonParams.scales.transition,
        duration: commonParams.duration,
        ease: commonParams.ease.in,
      },
      "transizione3"
    );
    tl.to(
      dennis,
      {
        top: commonParams.positions.exit,
        scale: commonParams.scales.transition,
        duration: commonParams.duration,
        ease: commonParams.ease.in,
      },
      "transizione3"
    );

    // Switch z-indices back
    tl.add(() => {
      gsap.set(ari, { zIndex: 1 });
      gsap.set(dennis, { zIndex: 0 });
    });

    // Complete cycle
    tl.to(
      ari,
      {
        top: commonParams.positions.top,
        scale: commonParams.scales.active,
        duration: commonParams.duration,
        ease: commonParams.ease.out,
      },
      "transizione4"
    );
    tl.to(
      dennis,
      {
        top: commonParams.positions.bottom,
        scale: commonParams.scales.inactive,
        duration: commonParams.duration,
        ease: commonParams.ease.out,
      },
      "transizione4"
    );

    // Event listeners for mouse interactions
    testimonialContainer.addEventListener("mouseenter", handleMouseEnter);
    testimonialContainer.addEventListener("mouseleave", handleMouseLeave);

    // Clean up
    return () => {
      testimonialContainer.removeEventListener("mouseenter", handleMouseEnter);
      testimonialContainer.removeEventListener("mouseleave", handleMouseLeave);
      tlRef.current?.kill();
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <div className="marquee-item w-[400px] px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background relative  flex items-center justify-center">
      <div className="testimonials_highlights" ref={testimonialContainerRef}>
        <div className="div-block-103">
          <TestimonialItem
            name="ari"
            text="Mika is head and shoulders above the crowd, he took my rough design ideas..."
            href="#ari_review"
            forwardedRef={ariRef}
          />
          <TestimonialItem
            name="dennis"
            text="He brings creative ideas to life with precision and care...."
            href="#dennis_review"
            forwardedRef={dennisRef}
          />
        </div>
      </div>
    </div>
  );
});

// Enhanced Gallery component with proper video handling
const EnhancedGalleryMarqueeItem = memo(() => {
  const videoMarqueeRef = useRef<HTMLDivElement>(null);
  const [userInteracted, setUserInteracted] = useState(true);

  // Detect user interaction to allow video autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);

      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  return (
    <div className="marquee-item px-8 py-4 w-[400px]  flex items-center justify-center">
      <div className="inline-flex gap-4 items-center">
        <div className="rounded-4xl bg-background/10 overflow-hidden h-32 w-80 flex justify-center">
          <div
            ref={videoMarqueeRef}
            className="flex !justify-center !items-center h-32"
          >
            <Gallery
              className="w-full h-full flex !justify-center !items-center"
              autoPlay={userInteracted}
              muted={true}
              playsInline={true}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-medium text-background">
            Case Studies
          </div>
          <p className="text-balance text-background/70 text-xs">
            Explore these three distinct case studies to see how I can help you.
          </p>
          <a
            href="#case-studies"
            className="mt-3 flex items-center gap-2 text-sm font-medium text-background transition-colors cursor-pointer w-34 h-8 relative group/cta"
          >
            <span className="rounded-full w-full p-1 ml-0.5 absolute z-10 group-hover/cta:-ml-1.5 group-hover/cta:translate-x-3/4 transition-all duration-300">
              <IconArrowRight className="w-5 h-5" duotone={false} />
            </span>
            <div className="relative ml-12 z-10 group-hover/cta:ml-4 transition-all duration-300">
              Learn more
            </div>
            <div className="absolute left-0 h-full w-8 aspect-square bg-accent z-0 rounded-full group-hover/cta:w-full transition-[width] duration-300"></div>
          </a>
        </div>
      </div>
    </div>
  );
});

// Skills Pills Marquee Item Component
const PillsMarqueeItem = memo(() => (
  <div className="marquee-item px-8 py-4 rounded-xl text-foreground dark:text-background w-[400px]  flex items-center justify-center">
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Pill text="Design" />
        <Pill text="Development" />
        <Pill text="Animation" />
      </div>
      <div className="flex items-center gap-2">
        <Pill text="User Interface" />
        <Pill text="GSAP" />
        <span className="pill5 text-sm px-5 py-1.5 border border-foreground/20 dark:border-background/20 rounded-full leading-snug transition-all duration-300 cursor-pointer select-none group/arrow relative overflow-hidden hover:border-accent hover:bg-accent min-w-max">
          <span className="relative z-10 inline-flex items-center gap-[0.4vw] group-hover/arrow:gap-[1vw] transition-all duration-300">
            More <IconArrowRight className="w-4 h-4" duotone={false} />
          </span>
        </span>
      </div>
    </div>
  </div>
));

// React Marquee Item Component
const ReactMarqueeItem = memo(() => (
  <div className="marquee-item px-8 py-4 bg-foreground/5 rounded-xl text-foreground dark:text-background w-[400px] flex items-center justify-center">
    React
  </div>
));

// Memoized Hero Title Component
const HeroTitle = memo(() => (
  <h1 className="mt-4 text-[10vw] text-wrap font-medium leading-none tracking-wide">
    I <span className="text-foreground dark:text-background">Turn</span>{" "}
    Imaginations
    <br />
    <div className="flex items-center justify-center gap-[4vw] w-full">
      Into
      <AsteriskCircleAnimated />
      <span className="text-foreground dark:text-background">Interactive</span>
    </div>
    <span className="text-foreground dark:text-background">Digital</span>{" "}
    Experiences
  </h1>
));

// Main Hero component - now much simpler with self-contained subcomponents
const Hero = () => {
  return (
    <section
      className="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-between"
      id="home"
    >
      <div className="flex items-center justify-center grow">
        <div className="flex flex-col justify-center text-center space-y-3 pb-24 font-var tracking-wide text-foreground/40 dark:text-background/40 uppercase font-robo">
          <div className="text-[2.5vw] font-nippo flex items-center justify-center gap-[4vw] font-medium">
            Designer <AnimatedArrow /> Developer
          </div>
          <HeroTitle />
        </div>
      </div>

      <div className="h-50 flex items-center w-full justify-center bg-background dark:bg-foreground border-t-2 border-foreground/10 dark:border-background/10">
        <div className="relative flex items-center w-full h-full overflow-hidden">
          <MarqueeContainer>
            <PillsMarqueeItem />
            <TestimonialsMarqueeItem />
            <EnhancedGalleryMarqueeItem />
            <ReactMarqueeItem />
          </MarqueeContainer>
        </div>
      </div>
    </section>
  );
};

export default Hero;
