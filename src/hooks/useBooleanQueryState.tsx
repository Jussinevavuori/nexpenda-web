import { useCallback } from "react";
import { useQueryState } from "./useQueryState";

export function useBooleanQueryState(
	key: string,
	truthy: string = "true",
	falsy: string | undefined | null = undefined
) {
	const encode = useCallback(
		(value: boolean) => {
			return value ? truthy : falsy;
		},
		[truthy, falsy]
	);

	const decode = useCallback(
		(arg: any) => {
			return arg === truthy;
		},
		[truthy]
	);

	return useQueryState<boolean>({ key, encode, decode });
}
