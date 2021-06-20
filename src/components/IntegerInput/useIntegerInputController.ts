import { useCallback, useMemo } from "react";
import { IntegerInputProps } from "./IntegerInput";

export function useIntegerInputController(props: IntegerInputProps) {
  const value = props.value;
  const onChange = props.onChange;
  const min = props.min;
  const max = props.max;

  const toInt = useMemo(() => createToInt(min, max), [min, max]);

  const int = useMemo(() => toInt(value), [value, toInt]);

  const setInt = useCallback(
    (n: number | string) => {
      onChange(toInt(n));
    },
    [onChange, toInt]
  );

  const addInt = useCallback(
    (n: number) => {
      onChange(toInt(int + n));
    },
    [int, onChange, toInt]
  );

  return {
    int,
    setInt,
    addInt,
  };
}

function createToInt(min: number | undefined, max: number | undefined) {
  const _max = max === undefined ? Number.POSITIVE_INFINITY : Math.round(max);
  const _min = min === undefined ? Number.NEGATIVE_INFINITY : Math.round(min);

  function clamp(n: number) {
    if (n > _max) return _max;
    if (n < _min) return _min;
    return n;
  }

  return function toInt(n: number | string) {
    return clamp(typeof n === "string" ? parseInt(n) : Math.round(n));
  };
}
