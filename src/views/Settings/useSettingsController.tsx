import ReactGA from "react-ga";
import { useCallback } from "react"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/utils/useRedirect"


export function useSettingsController() {
	const redirect = useRedirect()

	/**
	 * Auth and logout
	 */
	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)
	const handleLogout = useCallback(async function () {
		const result = await logout()
		if (result.isSuccess()) {
			ReactGA.event({
				action: "Log out",
				category: "User",
			})
			redirect(_ => _.login)
		}
	}, [logout, redirect])

	return {
		user,
		handleLogout,
	}
}