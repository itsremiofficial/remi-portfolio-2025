import { useEffect, useState } from "react";
import { LenisProvider } from "./context/LenisContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./layout/Header";
import Hero from "./sections/Hero";
import WelcomeMarquee from "./sections/WelcomeMarquee";
import Works from "./sections/Works";
import About from "./sections/About";
import Squircle from "./components/ui/Squircle";
import CursorFollower from "./components/ui/CursroFollower";

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

  return (
    <ThemeProvider>
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
          {/* <Skills /> */}
          <section
            className="w-full min-h-screen flex flex-col gap-10 items-center justify-center bg-background"
            id="work"
          >
            <CursorFollower
              cursor={<div className="size-48 bg-foreground"></div>}
            >
              <Squircle
                height={350}
                width={650}
                roundness={0.2}
                color="#ff5722"
              >
                <div className="flex items-center justify-center w-full h-full text-white font-bold">
                  Hello
                </div>
              </Squircle>
            </CursorFollower>
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
