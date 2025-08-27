import React from "react";
import { ThemeContext } from "../context/ThemeContextValue";

const ThemeInfo: React.FC = () => {
  return (
    <ThemeContext.Consumer>
      {(context) => {
        if (!context) {
          return <div>Theme context not available</div>;
        }

        const { isDark, colorScheme } = context;

        return (
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold">Current Theme Settings</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Mode:{" "}
                <span className="font-mono">{isDark ? "Dark" : "Light"}</span>
              </li>
              <li>
                Color Scheme: <span className="font-mono">{colorScheme}</span>
              </li>
            </ul>
          </div>
        );
      }}
    </ThemeContext.Consumer>
  );
};

export default ThemeInfo;
