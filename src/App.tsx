import { useEffect, useState } from "react";
import { LenisProvider } from "./context/LenisContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./layout/Header";
import Hero from "./sections/Hero";
import WelcomeMarquee from "./sections/WelcomeMarquee";
import Works from "./sections/Works";
import About from "./sections/About";
import Squircle from "./components/ui/Squircle";
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

  useEffect(() => {
    // Add mac style cursor class (remove if you want to toggle later)
    document.documentElement.classList.add("apple-cursors");
    return () => {
      document.documentElement.classList.remove("apple-cursors");
    };
  }, []);

  return (
    <ThemeProvider>
      <MacCursorAuto />
      <LenisProvider
        options={{
          duration: 3,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: "vertical",
          smooth: true,
          mouseMultiplier: 1,
          touchMultiplier: 2,
          normalizeWheel: true,
          autoResize: true,
        }}
        autoRaf={true}
        root={true}
        className="lenis-smooth"
      >
        <div className="grain"></div>
        <Header fontsLoaded={fontsLoaded} />

        <main className="overflow-x-hidden text-black dark:text-white relative">
          <Hero />
          <WelcomeMarquee />
          <About />
          <Works />
          {/* <MatterCanvas /> */}
          {/* <Skills /> */}
          <section
            className="w-full min-h-screen flex flex-col gap-10 items-center justify-center bg-background"
            id="work"
            data-cursor="accent"
            data-cursor-text="Explore"
          >
            <Squircle height={350} width={650} roundness={0.2} color="#ff5722">
              <div
                className="flex items-center justify-center w-full h-full text-white font-bold"
                data-cursor="link"
                data-cursor-text="Open"
              >
                Hello
              </div>
            </Squircle>
          </section>
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
        </main>
      </LenisProvider>
    </ThemeProvider>
  );
};

export default App;
