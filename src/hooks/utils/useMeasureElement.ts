import { MutableRefObject, useEffect, useRef, useState } from "react";

export function useMeasureElement<E extends HTMLElement>(): [
  MutableRefObject<E | null>,
  DOMRect | null
] {
  const ref = useRef<E | null>(null);

  const [state, setState] = useState<null | DOMRect>(null);

  useEffect(() => {
    function handler() {
      const el = ref.current;
      if (!el) {
        setState(null);
      } else {
        setState(el.getBoundingClientRect());
      }
    }
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  });

  return [ref, state];
}
