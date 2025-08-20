import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./layout/Header";
import useLocoScroll from "./hooks/useLocomotiveScroll";

const App = () => {
  const ref = useRef(null);
  const [preloader, setPreload] = useState(true);

  // Pass the preloader state to the hook
  const { scrollToSection, scrollProgress } = useLocoScroll(!preloader);

  useEffect(() => {
    if (!preloader && ref) {
      if (typeof window === "undefined" || !window.document) {
        return;
      }
    }
  }, [preloader]);

  const [timer, setTimer] = useState(3);

  const id = useRef<Number>(null);

  const clear = () => {
    window.clearInterval(id.current as unknown as number);
    setPreload(false);
  };

  useEffect(() => {
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
    return () => clear();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      clear();
    }
  }, [timer]);

  if (typeof window === "undefined" || !window.document) {
    return null;
  }

  return (
    <ThemeProvider>
      <Header handleScroll={scrollToSection}/>
      <main
        id="main-container"
        data-scroll-container
        ref={ref}
        className="overflow-x-hidden"
      >
        <section
          className="w-full min-h-screen flex items-center justify-center bg-5"
          id="home"
        >
          Home
        </section>
        <section
          className="w-full min-h-screen flex items-center justify-center"
          id="work"
        >
          Work
        </section>
        <section
          className="w-full min-h-screen flex items-center justify-center bg-5"
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
    </ThemeProvider>
  );
};

export default App;
