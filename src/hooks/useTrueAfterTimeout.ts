import { useEffect, useState } from "react";

export function useTrueAfterTimeout(timeout: number) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue(true);
    }, timeout);

    return () => window.clearTimeout(timeoutId);
  }, [timeout, setValue]);

  return value;
}
