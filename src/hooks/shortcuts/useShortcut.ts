import { useCallback, useEffect } from "react";

type ShortcutKeyCombination = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
};

type ShortcutHandler = () => MaybePromise<void>;

export function useShortcut(
  shortcut: ShortcutKeyCombination,
  handler: ShortcutHandler
) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === shortcut.key &&
        !!e.ctrlKey === !!shortcut.ctrl &&
        !!e.altKey === !!shortcut.alt &&
        !!e.shiftKey === !!shortcut.shift
      ) {
        e.preventDefault();
        handler();
      }
    },
    [shortcut, handler]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);
}
