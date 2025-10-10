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

      if (w >= 1366) width = maxWidth;
      else if (w >= 1024) width = Math.round(maxWidth * 0.8);
      else if (w >= 768) width = Math.round(maxWidth * 0.66);
      else if (w >= 640) width = Math.round(maxWidth * 0.55);
      else width = Math.round(maxWidth * 0.45);

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
