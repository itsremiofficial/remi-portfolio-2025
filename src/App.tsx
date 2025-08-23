import { useEffect, useState } from "react";
import { LenisProvider } from "./context/LenisContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./layout/Header";
import Hero from "./sections/Hero";

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

        <main className="overflow-x-hidden text-9xl font-var font-robo uppercase text-black dark:text-white">
          <Hero />
          <section
            className="w-full min-h-screen flex items-center justify-center"
            id="work"
          >
            Work
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
