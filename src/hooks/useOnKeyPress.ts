import { useCallback, useEffect } from "react";

export function useOnKeyPress(
  key: string | number,
  callback: Function,
  options?: {
    onKeyUp?: boolean;
    if?: boolean;
    ifNot?: boolean;
  }
) {
  const eventHandler = useCallback(
    (ev: KeyboardEvent) => {
      console.log({ key: ev.key, keyCode: ev.keyCode });
      if (ev.key === key || ev.keyCode === key) {
        console.log("Matches");
        callback();
      }
    },
    [key, callback]
  );

  useEffect(() => {
    const ifConditionPassed = options?.if === true || options?.if === undefined;
    const ifNotConditionPassed =
      options?.ifNot === true || options?.ifNot === undefined;

    if (ifConditionPassed && ifNotConditionPassed) {
      console.log("Adding event listener");

      const onKeyUp = Boolean(options?.onKeyUp);

      if (onKeyUp) {
        window.addEventListener("keyup", eventHandler);
        return () => window.removeEventListener("keyup", eventHandler);
      } else {
        window.addEventListener("keydown", eventHandler);
        return () => window.removeEventListener("keydown", eventHandler);
      }
    } else {
      console.log("Skipping event listener");
    }
  }, [options]);
}
