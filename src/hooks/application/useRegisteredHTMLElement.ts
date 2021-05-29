import { useCallback, useMemo } from "react";
import { useElementContext } from "../../contexts/ElementContext.context";

export function useRegisteredHTMLElement(
  key: string
): [HTMLElement | null, (t: HTMLElement | null) => void] {
  const { elements, register, deregister } = useElementContext();

  const state = useMemo(() => {
    return elements[key] ?? null;
  }, [key, elements]);

  const setState = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        register(key, element);
      } else {
        deregister(key);
      }
    },
    [register, deregister, key]
  );

  return [state, setState];
}
