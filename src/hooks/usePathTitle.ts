import { useEffect } from "react";
import { useRouteData } from "./useRouteData";

function getDocumentTitle(subtitle?: string) {
  const base = `Expence`;

  if (!subtitle) {
    return base;
  } else {
    return `${base} | ${subtitle}`;
  }
}

export function usePathTitle() {
  const routeData = useRouteData();

  useEffect(() => {
    document.title = getDocumentTitle(routeData?.title);
    return () => {
      document.title = getDocumentTitle();
    };
  });
}
