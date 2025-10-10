import { useEffect, useState } from "react";

type Dimensions = {
  width: number;
  height: number;
  radius: number;
};

export const useRadius = (width: number, height: number): Dimensions => {
  const [dims, setDims] = useState<Dimensions>({
    width,
    height,
    radius: Math.min(width, height) / 4,
  });

  useEffect(() => {
    const newRadius = Math.min(width, height) / 4;
    setDims((prev) => ({ ...prev, radius: newRadius }));
  }, [width, height]);

  return dims;
};
