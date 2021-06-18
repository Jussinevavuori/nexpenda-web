import { useEffect } from "react";

export function useVhFix() {
  const root = document.documentElement;
  useEffect(() => {
    const eventHandler = () => {
      const viewportHeight = window.innerHeight;
      root.style.setProperty("--full-vh", `${0.9999 * viewportHeight}px`);
      root.style.setProperty("--vh", `${viewportHeight / 100}px`);
    };
    eventHandler();
    window.addEventListener("resize", eventHandler);
    return () => {
      window.removeEventListener("resize", eventHandler);
    };
  });
}
