import { LenisProvider } from "./context/LenisContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./layout/Header";

const App = () => {
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
          <Header />
        <main className="overflow-x-hidden">
          <section
            className="w-full min-h-screen flex items-center justify-center"
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
