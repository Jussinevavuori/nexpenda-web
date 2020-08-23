import React from "react"
import { DashboardTabView } from "./DashboardTabView"
import { useStoreState } from "../../store"

export function DashboardTab() {

	const user = useStoreState(_ => _.auth.user)

	if (!user) return null

	return <DashboardTabView user={user} />
}