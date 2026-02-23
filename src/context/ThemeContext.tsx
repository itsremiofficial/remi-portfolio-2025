import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  ThemeContext,
  type ColorScheme,
  type ThemeMode,
} from "./ThemeContextValue";

// Helper function to safely access localStorage
const getStorageItem = (key: string, fallback: string): string => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : fallback;
  } catch (e) {
    return fallback;
  }
};

// Helper function to safely set localStorage
const setStorageItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => getStorageItem("color-scheme", "default") as ColorScheme,
  );

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = getStorageItem("theme-mode", "");
    if (stored === "light" || stored === "dark") return stored;
    // No stored preference — use device/OS setting
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // compute isDark from themeMode
  const isDark = themeMode === "dark";

  // Toggle between light and dark mode with animation
  const toggleThemeMode = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setThemeMode(themeMode === "light" ? "dark" : "light");
    }, 300); // Wait for transition to reach halfway
  };

  // Save theme mode to localStorage when it changes
  useEffect(() => {
    setStorageItem("theme-mode", themeMode);
  }, [themeMode]);

  // Save color scheme to localStorage when it changes
  useEffect(() => {
    setStorageItem("color-scheme", colorScheme);
  }, [colorScheme]);

  // Apply theme classes and manage transition state
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(themeMode);
    document.documentElement.setAttribute("data-color-scheme", colorScheme);

    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600); // Total animation duration
      return () => clearTimeout(timer);
    }
  }, [themeMode, colorScheme, isTransitioning]);

  // Custom setter to update state and localStorage
  const handleSetColorScheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        themeMode,
        isDark,
        setColorScheme: handleSetColorScheme,
        setThemeMode: handleSetThemeMode,
        toggleThemeMode,
        isTransitioning,
      }}
    >
      {children}
      {/* {isTransitioning && <div className="theme-transition-overlay" />} */}
    </ThemeContext.Provider>
  );
};
