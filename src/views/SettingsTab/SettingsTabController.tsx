import React from "react"
import { SettingsTabView } from "./SettingsTabView"
import { useStoreState, useStoreActions } from "../../store"

export type SettingsTabProps = {

}

export function SettingsTab(props: SettingsTabProps) {
	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)

	function handleLogout() {
		logout()
	}

	if (!user) return null

	return <SettingsTabView
		user={user}
		handleLogout={handleLogout}
	/>
}