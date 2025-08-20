import type { ColorScheme, ThemeMode } from "../context/ThemeContextValue";

interface ThemeColorOptions {
  baseLight: string;
  baseDark: string;
  accentLight: string;
  accentDark: string;
}

const themeColorMap: Record<ColorScheme, ThemeColorOptions> = {
  default: {
    baseLight: "#ffffff",
    baseDark: "#121212",
    accentLight: "#3b82f6",
    accentDark: "#60a5fa",
  },
  purple: {
    baseLight: "#faf5ff",
    baseDark: "#1a1625",
    accentLight: "#8b5cf6",
    accentDark: "#a78bfa",
  },
  blue: {
    baseLight: "#f0f9ff",
    baseDark: "#0c1220",
    accentLight: "#0ea5e9",
    accentDark: "#38bdf8",
  },
  green: {
    baseLight: "#f0fdf4",
    baseDark: "#0c1f17",
    accentLight: "#10b981",
    accentDark: "#34d399",
  },
};

export const generateThemeVars = (
  colorScheme: ColorScheme,
  themeMode: ThemeMode
) => {
  const colors = themeColorMap[colorScheme];

  return {
    "--theme-base": themeMode === "dark" ? colors.baseDark : colors.baseLight,
    "--theme-accent":
      themeMode === "dark" ? colors.accentDark : colors.accentLight,
    "--theme-text": themeMode === "dark" ? colors.baseLight : colors.baseDark,
    "--theme-shadow":
      themeMode === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
  };
};

export const applyThemeVarsToElement = (
  element: HTMLElement,
  colorScheme: ColorScheme,
  themeMode: ThemeMode
) => {
  const vars = generateThemeVars(colorScheme, themeMode);

  Object.entries(vars).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
};
