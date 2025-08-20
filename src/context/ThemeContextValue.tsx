import { createContext } from "react";

export type ColorScheme = "default" | "purple" | "blue" | "green";
export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  colorScheme: ColorScheme;
  themeMode: ThemeMode;
  isDark: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  isTransitioning: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
