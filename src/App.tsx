import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./layout/Header";
import Hero from "./sections/Hero";
import WelcomeMarquee from "./components/WelcomeMarquee";
import Works from "./sections/Works";
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
import FluidCursor from "./components/ui/fluidCursor";
import Testimonials from "./sections/Testimonials";
import Skills from "./sections/Skills";
import { useScrollTo } from "./hooks/useLenis";

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
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { scrollToElement, isReady, lenis } = useScrollTo();
  const location = useLocation();

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
      <div className="grain"></div>
      <Header fontsLoaded={fontsLoaded} />

      <main className="overflow-x-hidden text-foreground dark:text-background relative">
        {/* <Skills /> */}
        <Hero />
        <WelcomeMarquee />
        <About />
        <Works />
        <Services />
        <Skills />
        <ServicesMarquee />
        <Testimonials />
        <section
          className="w-full min-h-screen flex items-center justify-center"
          id="services"
        >
          Services
        </section>
        <section
          className="w-full min-h-screen flex items-center justify-center"
          id="contact"
        >
          Contact
        </section>
        <section
          className="w-full min-h-screen flex items-center justify-center"
          id="contact"
        >
          Contact
        </section>
        <section
          className="w-full min-h-screen flex items-center justify-center"
          id="contact"
        >
          Contact
        </section>
        <section
          className="w-full min-h-screen flex items-center justify-center"
          id="contact"
        >
          Contact
        </section>
        <section
          className="w-full min-h-screen flex items-center justify-center"
          id="contact"
        >
          Contact
        </section>
      </main>
    </>
  );
};

export default App;
