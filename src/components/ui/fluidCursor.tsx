"use client";
import { useEffect } from "react";

import fluidCursor from "../../utils/fluidCursor";

const FluidCursor = () => {
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <div className="z-2 fixed left-0 top-0 pointer-events-none">
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};
export default FluidCursor;
