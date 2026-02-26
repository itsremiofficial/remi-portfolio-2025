import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const update = () => {
      setIsMobile(mql.matches);
    };

    // Initial sync
    update();

    // Modern + fallback listener handling
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
    } else {
      // Safari / old browsers
      mql.addListener(update);
    }

    // Fallback: some environments miss matchMedia change events (rare, but safe)
    window.addEventListener("resize", update);

    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", update);
      } else {
        mql.removeListener(update);
      }
      window.removeEventListener("resize", update);
    };
  }, []);

  return isMobile;
}
