import { useEffect, useState } from "react";

export function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  function navigate(newPath: string) {
    window.history.pushState({}, "", newPath);
    setPath(newPath);
  }

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return { path, navigate };
}
