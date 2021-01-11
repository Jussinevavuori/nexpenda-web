import { useCallback } from "react";
import { useRedirect } from "../../hooks/useRedirect";
import { useStoreState } from "../../store";

export function useLogoController() {

	const redirect = useRedirect()

	const isLoggedIn = useStoreState(_ => _.auth.isLoggedIn)

	const handleClick = useCallback(() => {
		if (isLoggedIn) {
			redirect(_ => _.dashboard)
		} else {
			redirect(_ => _.login)
		}
	}, [isLoggedIn, redirect])

	return { handleClick }

}