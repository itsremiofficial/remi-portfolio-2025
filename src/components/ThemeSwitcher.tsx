import type { ColorScheme } from "../context/ThemeContextValue";
import { useTheme } from "../hooks/useTheme";

const ThemeSwitcher = () => {
  const {
    colorScheme,
    themeMode,
    setColorScheme,
    toggleThemeMode,
    isTransitioning,
  } = useTheme();

  const colorSchemes: ColorScheme[] = ["default", "purple", "blue", "green"];

  return (
    <div className="flex items-center gap-4">
      {/* <div className="flex gap-2">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme}
            className={`w-6 h-6 rounded-full border ${
              colorScheme === scheme ? "ring-2 ring-offset-2" : ""
            }`}
            style={{
              backgroundColor: `var(--color-primary)`,
              cursor: isTransitioning ? "not-allowed" : "pointer",
            }}
            onClick={() => !isTransitioning && setColorScheme(scheme)}
            disabled={isTransitioning}
            aria-label={`Switch to ${scheme} theme`}
          />
        ))}
      </div> */}

      <button
        onClick={toggleThemeMode}
        disabled={isTransitioning}
        className="p-2 rounded-md bg-primary text-primary-foreground"
        aria-label={`Switch to ${
          themeMode === "light" ? "dark" : "light"
        } mode`}
      >
        {themeMode === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
