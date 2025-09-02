import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/lenis.css";
import App from "./App.tsx";
import MacCursorAuto from "./components/ui/MacCursorAuto.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MacCursorAuto />
    <App />
  </StrictMode>
);
