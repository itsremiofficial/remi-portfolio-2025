// useResponsiveVars.ts
// Returns numeric ratio (width / height) and sets CSS variables dynamically.

"use client";
import { useEffect, useState } from "react";

type ResponsiveVars = {
  width: number;
  height: number;
  ratio: number; // numeric ratio
};

export const useResponsiveVars = (
  maxWidth: number,
  maxHeight: number,
  suffix: string,
  customRatio?: number
): ResponsiveVars => {
  const baseRatio = customRatio ?? maxWidth / maxHeight;

  const [vars, setVars] = useState<ResponsiveVars>({
    width: maxWidth,
    height: maxHeight,
    ratio: baseRatio,
  });

  useEffect(() => {
    const updateVars = () => {
      const w = window.innerWidth;
      let width = maxWidth;

      if (w >= 1536) width = Math.round(maxWidth * 0.9);
      else if (w >= 1440) width = Math.round(maxWidth * 0.85);
      else if (w >= 1366) width = Math.round(maxWidth * 0.83);
      else if (w >= 1280) width = Math.round(maxWidth * 0.80);
      else if (w >= 1024) width = Math.round(maxWidth * 0.75);
      else width = Math.round(maxWidth * 0.8);

      const height = Math.round(width / baseRatio);
      const ratio = +(width / height).toFixed(3);

      document.documentElement.style.setProperty(
        `--width-${suffix}`,
        `${width}px`
      );
      document.documentElement.style.setProperty(
        `--height-${suffix}`,
        `${height}px`
      );
      document.documentElement.style.setProperty(
        `--ratio-${suffix}`,
        `${ratio}`
      );

      setVars({ width, height, ratio });
    };

    updateVars();
    window.addEventListener("resize", updateVars);
    return () => window.removeEventListener("resize", updateVars);
  }, [maxWidth, maxHeight, suffix, baseRatio]);

  return vars;
};
