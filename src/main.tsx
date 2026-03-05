import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./styles/lenis.css";
import App from "./App.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import Projects from "./pages/Projects.tsx";
import { LenisProvider } from "./context/LenisContext";
import { ThemeProvider } from "./context/ThemeContext";
import FluidCursor from "./components/ui/fluidCursor.tsx";
import NoiseOverlay from "./components/NoiseOverlay.tsx";
import MacCursorAuto from "./components/ui/MacCursorAuto.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <MacCursorAuto />
      <NoiseOverlay
        enabled={true}
        patternSize={300}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={3}
        patternAlpha={14}
        // className="mix-blend-overlay"
      />
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
          <FluidCursor />
        </BrowserRouter>
      </LenisProvider>
    </ThemeProvider>
  </StrictMode>,
);
