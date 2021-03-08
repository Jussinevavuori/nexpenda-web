import { useCallback } from "react";
import { useQueryState } from "./useQueryState";

export function useBooleanQueryState(
  key: string,
  method: Parameters<typeof useQueryState>[0]["method"],
  truthy: string = "true"
) {
  const encode = useCallback((v: boolean) => (v ? truthy : falsy), [truthy]);

  const decode = useCallback((arg: any) => arg === truthy, [truthy]);

  return useQueryState<boolean>({ key, encode, decode, method });
}

const falsy = undefined;
