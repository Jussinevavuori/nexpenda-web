import { useEffect, useState } from "react";

function getRandomValue(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function useRandomValue(min: number, max: number) {
  const [value, setValue] = useState(min);

  useEffect(() => {
    setValue(getRandomValue(min, max));
  }, [min, max]);

  return value;
}
