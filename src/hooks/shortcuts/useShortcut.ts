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
      // If focused on an input, cancel action
      if (
        ["INPUT", "TEXTFIELD"].includes(document.activeElement?.tagName ?? "")
      ) {
        return;
      }

      // Ensure exact correct key combination
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
