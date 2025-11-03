import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./layout/Header";
import Hero from "./sections/Hero";
import WelcomeMarquee from "./components/WelcomeMarquee";
import About from "./sections/About";
import MacCursorAuto from "./components/ui/MacCursorAuto";
import {
  CustomEase,
  DrawSVGPlugin,
  InertiaPlugin,
  MorphSVGPlugin,
  Observer,
  ScrollTrigger,
  SplitText,
} from "gsap/all";
import gsap from "gsap";
import Services from "./sections/Services";
import ServicesMarquee from "./components/ServicesMarquee";
import Testimonials from "./sections/Testimonials";
import Skills from "./sections/Skills";
import ProjectsGallery from "./sections/ProjectsGallery";
import { useScrollTo } from "./hooks/useLenis";
import { Footer } from "./sections/Footer";
import PreLoader from "./components/Loader/PreLoader";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  Observer,
  CustomEase,
  MorphSVGPlugin,
  DrawSVGPlugin,
  InertiaPlugin
);

const App = () => {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const { scrollToElement, isReady, lenis } = useScrollTo();
  const location = useLocation();
  const hasAnimatedRef = useRef(false);

  // Handle preloader completion
  const handlePreloaderComplete = () => {
    // Show main content immediately for smooth transition
    // PreLoader will fade out while main content fades in
    setPreloaderComplete(true);
  };

  // Animate header and hero elements when preloader completes
  useEffect(() => {
    if (preloaderComplete && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;

      // Create smooth entrance animations
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Animate header - slide down and fade in
      tl.fromTo(
        ".header",
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
        }
      );

      // Animate hero designer/developer text - fade in and scale
      tl.fromTo(
        ".hero h4",
        {
          opacity: 0,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
        },
        "-=0.5"
      );

      // Animate hero title (h1) - fade in and slide up
      tl.fromTo(
        ".hero h1",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        },
        "-=0.4"
      );

      // Animate bottom marquee section - slide up and fade in
      tl.fromTo(
        ".hero > div:nth-child(2)",
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        },
        "-=0.6"
      );

      // Animate main sections - fade in
      tl.fromTo(
        "main > section:not(#home)",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
        },
        "-=0.3"
      );
    }
  }, [preloaderComplete]);

  // Handle scroll to section after navigation from ProjectDetail
  useEffect(() => {
    const scrollTarget = sessionStorage.getItem("scrollToSection");

    if (scrollTarget && location.pathname === "/") {
      // Clear the flag immediately
      sessionStorage.removeItem("scrollToSection");

      console.log("Scroll target detected:", scrollTarget);

      // Wait for DOM and Lenis to be ready
      const attemptScroll = (retries = 0) => {
        const targetElement = document.getElementById(scrollTarget);

        console.log(
          `Attempt ${retries}: Element found:`,
          !!targetElement,
          "Lenis ready:",
          isReady
        );

        if (targetElement && isReady && lenis) {
          const elementTop = targetElement.offsetTop;
          const scrollPosition = elementTop - 100; // Calculate position with offset
          console.log(
            "Scrolling with Lenis to:",
            scrollTarget,
            "Element offsetTop:",
            elementTop,
            "Scroll to:",
            scrollPosition
          );

          // First, ensure we're at the top
          window.scrollTo(0, 0);

          // Then use requestAnimationFrame to ensure render is complete
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // Use Lenis directly to scroll to position
              const ease = CustomEase.create("custom", "0.7, 0, 0.2, 1");
              lenis.scrollTo(scrollPosition, {
                duration: 2.5,
                easing: (t: number) => ease(t),
                force: true,
                lock: true,
                onComplete: () => {
                  console.log(
                    "Scroll complete. Current scroll position:",
                    window.scrollY
                  );
                },
              });
            });
          });
        } else if (targetElement && !isReady) {
          console.log(
            "Scrolling with native to:",
            scrollTarget,
            "offsetTop:",
            targetElement.offsetTop
          );
          // Fallback to native scroll
          const elementTop = targetElement.offsetTop - 100;
          window.scrollTo({
            top: elementTop,
            behavior: "smooth",
          });
        } else if (retries < 30) {
          // Retry if element not found (up to 3 seconds)
          setTimeout(() => attemptScroll(retries + 1), 100);
        } else {
          console.log("Failed to scroll after 30 retries");
        }
      };

      // Longer initial delay to ensure everything is rendered
      setTimeout(() => attemptScroll(), 1000);
    }
  }, [location, scrollToElement, isReady, lenis]);

  return (
    <>
      <MacCursorAuto />
      <div className="grain" />

      {/* PreLoader layer - always rendered but fades out */}
      <PreLoader onComplete={handlePreloaderComplete} />

      {/* Main content - animated individually when preloader completes */}
      <div
        style={{
          pointerEvents: preloaderComplete ? "auto" : "none",
        }}
      >
        <Header fontsLoaded={preloaderComplete} />

        <main className="overflow-x-hidden text-foreground dark:text-background relative">
          {/* <Scene /> */}
          <Hero />
          <WelcomeMarquee />
          <About />
          {/* <Works /> */}
          <ProjectsGallery />
          <Services />
          <Skills />
          <ServicesMarquee />
          <Testimonials />
          <Footer />
        </main>
      </div>

      {/* Initial styles to hide elements before GSAP animations */}
      <style>{`
        .header {
          opacity: 0;
        }
        .hero h4,
        .hero h1,
        .hero > div:nth-child(2) {
          opacity: 0;
        }
        main > section:not(#home) {
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default App;
