import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "../locomotive.css";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const useLocoScroll = (start) => {
  const locoScrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useLayoutEffect(() => {
    if (!start) return;

    // Import Locomotive Scroll dynamically to avoid SSR issues
    const importLocomotiveScroll = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        const scrollEl = document.querySelector("#main-container");

        if (!scrollEl) {
          console.warn("Scroll container not found");
          return;
        }

        // Create a new instance with a simpler config
        const locomotiveScroll = new LocomotiveScroll({
          el: scrollEl,
          smooth: true,
          multiplier: 1,
        });

        // Store the instance
        locoScrollRef.current = locomotiveScroll;

        // Set up scroll event listener using window as fallback if needed
        const handleScroll = () => {
          ScrollTrigger.update();

          // Calculate progress using window scroll position as fallback
          const windowHeight = scrollEl.scrollHeight - window.innerHeight;
          const windowScroll = window.scrollY;
          const windowProgress = (windowScroll / windowHeight) * 100;
          setScrollProgress(Math.min(Math.max(windowProgress, 0), 100));
        };

        // Try to use native Locomotive Scroll events if available
        if (locomotiveScroll && typeof locomotiveScroll.on === "function") {
          locomotiveScroll.on("scroll", (args) => {
            ScrollTrigger.update();
            if (args && args.limit && args.scroll) {
              const totalHeight = args.limit.y;
              const currentScroll = args.scroll.y;
              const progress = (currentScroll / totalHeight) * 100;
              setScrollProgress(Math.min(Math.max(progress, 0), 100));
            }
          });
        } else {
          // Fallback to window scroll events
          window.addEventListener("scroll", handleScroll);
        }

        // Set up ScrollTrigger proxy with simplified implementation
        ScrollTrigger.scrollerProxy(scrollEl, {
          scrollTop(value) {
            if (locomotiveScroll) {
              if (arguments.length) {
                // Try different scroll methods based on API availability
                if (typeof locomotiveScroll.scrollTo === "function") {
                  locomotiveScroll.scrollTo(value);
                } else if (scrollEl) {
                  scrollEl.scrollTop = value;
                }
                return value;
              }

              // Try to get scroll position using different APIs
              return (
                locomotiveScroll.scroll?.instance?.scroll?.y ||
                scrollEl.scrollTop ||
                window.scrollY
              );
            }
            return 0;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          pinType: scrollEl.style.transform ? "transform" : "fixed",
        });

        // Create a safer update function
        const lsUpdate = () => {
          if (
            locomotiveScroll &&
            typeof locomotiveScroll.update === "function"
          ) {
            try {
              locomotiveScroll.update();
            } catch (err) {
              console.warn("Failed to update LocomotiveScroll:", err);
            }
          }
        };

        // Configure ScrollTrigger
        ScrollTrigger.defaults({
          scroller: scrollEl,
        });

        ScrollTrigger.addEventListener("refresh", lsUpdate);
        ScrollTrigger.refresh();

        // Return cleanup function
        return () => {
          if (typeof locomotiveScroll.destroy === "function") {
            try {
              locomotiveScroll.destroy();
            } catch (err) {
              console.warn("Failed to destroy LocomotiveScroll:", err);
            }
          }

          window.removeEventListener("scroll", handleScroll);
          ScrollTrigger.removeEventListener("refresh", lsUpdate);
        };
      } catch (error) {
        console.error("Error initializing LocomotiveScroll:", error);
      }
    };

    // Start the import process
    const cleanup = importLocomotiveScroll();
    return () => {
      // Call the cleanup function if it was returned
      if (cleanup && typeof cleanup.then === "function") {
        cleanup.then((cleanupFn) => {
          if (cleanupFn) cleanupFn();
        });
      }
    };
  }, [start]);

  const scrollToSection = (target) => {
    if (!locoScrollRef.current) return;

    try {
      // Try the scrollTo method if available
      if (typeof locoScrollRef.current.scrollTo === "function") {
        // Remove problematic options - just keep the essential ones
        locoScrollRef.current.scrollTo(target, {
          duration: 500, // Even shorter for faster scrolling
          offset: -100,
          // Remove easing and disableLerp which may be causing issues
        });
      } else {
        // Fallback to standard browser scroll with faster behavior
        const element =
          typeof target === "string" ? document.querySelector(target) : target;
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    } catch (err) {
      console.warn("Error in scrollToSection:", err);
      // Final fallback
      const element =
        typeof target === "string" ? document.querySelector(target) : target;
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return { scrollToSection, scrollProgress };
};

export default useLocoScroll;
