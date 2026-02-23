import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.otf"],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          "three-core": ["three"],
          "three-react": ["@react-three/fiber", "@react-three/drei"],
          gsap: ["gsap", "@gsap/react"],
          vendor: ["react", "react-dom", "react-router-dom"],
          motion: ["motion"],
          physics: ["matter-js"],
          scroll: ["lenis"],
        },
      },
    },
  },
});
