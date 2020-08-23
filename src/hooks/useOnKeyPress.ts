import { useCallback, useEffect } from "react";

export function useOnKeyPress(
  key:
    | string
    | number
    | {
        key: string | number;
        shift?: boolean;
        alt?: boolean;
        ctrl?: boolean;
      },
  callback: Function,
  options?: {
    onKeyUp?: boolean;
    if?: boolean;
    ifNot?: boolean;
  }
) {
  const eventHandler = useCallback(
    (ev: KeyboardEvent) => {
      const matchTarget = typeof key === "object" ? key.key : key;

      const keyMatch = ev.key === matchTarget || ev.keyCode === matchTarget;

      if (!keyMatch) return;

      const shiftMatch =
        typeof key !== "object" ||
        key.shift === undefined ||
        key.shift === ev.shiftKey;

      if (!shiftMatch) return;

      const altMatch =
        typeof key !== "object" ||
        key.alt === undefined ||
        key.alt === ev.altKey;

      if (!altMatch) return;

      const ctrlMatch =
        typeof key !== "object" ||
        key.ctrl === undefined ||
        key.ctrl === ev.ctrlKey;

      if (!ctrlMatch) return;

      callback();
    },
    [key, callback]
  );

  useEffect(() => {
    const ifPassed = options?.if === true || options?.if === undefined;
    const ifNotPassed = options?.ifNot === true || options?.ifNot === undefined;

    if (ifPassed && ifNotPassed) {
      const onKeyUp = Boolean(options?.onKeyUp);

      if (onKeyUp) {
        window.addEventListener("keyup", eventHandler);
        return () => window.removeEventListener("keyup", eventHandler);
      } else {
        window.addEventListener("keydown", eventHandler);
        return () => window.removeEventListener("keydown", eventHandler);
      }
    }
  }, [options, eventHandler]);
}
