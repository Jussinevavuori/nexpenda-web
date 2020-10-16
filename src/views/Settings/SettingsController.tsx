import React, { useCallback } from "react"
import { SettingsView } from "./SettingsView"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/useRedirect"

export type SettingsProps = {

}

export function Settings(props: SettingsProps) {
	const redirect = useRedirect()

	/**
	 * Auth and logout
	 */
	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)
	const handleLogout = useCallback(async function () {
		const result = await logout()
		if (result.isSuccess()) {
			redirect(_ => _.login)
		}
	}, [logout, redirect])

	if (!user) return null

	return <SettingsView
		user={user}
		handleLogout={handleLogout}
	/>
}