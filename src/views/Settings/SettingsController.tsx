import React, { useState } from "react"
import { SettingsView } from "./SettingsView"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/useRedirect"
import { useHashOpenState } from "../../hooks/useHashOpenState"
import { ProcessQueue, ProcessQueueProgress } from "../../utils/ProcessQueue/ProcessQueue"
import { PromiseType } from "../../types"
import { useMountedRef } from "../../hooks/useMountedRef"

export type SettingsProps = {

}

export function Settings(props: SettingsProps) {
	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)

	const mounted = useMountedRef()

	const [uploaderOpen, setUploaderOpen] = useHashOpenState("uploader")

	const transactions = useStoreState(_ => _.transactions.items)
	const deleteTransaction = useStoreActions(_ => _.transactions.deleteTransaction)

	const [progress, setProgress] = useState<ProcessQueueProgress<PromiseType<ReturnType<typeof deleteTransaction>>>>()

	const redirect = useRedirect()

	async function handleLogout() {
		const result = await logout()
		if (result.isSuccess()) {
			redirect(_ => _.login)
		}
	}

	async function handleDeleteAll() {
		if (transactions.length > 0) {
			const uploadProcessQueue = new ProcessQueue({
				chunksize: 7,
				updateProgress: (progress) => {
					if (!mounted.current) return
					setProgress(progress)
				},
				queue: transactions.map(row => () => {
					return deleteTransaction(row.id)
				})
			})
			await uploadProcessQueue.run()
		}
	}

	if (!user) return null

	return <SettingsView
		uploaderOpen={uploaderOpen}
		onUploaderClose={() => setUploaderOpen(false)}
		onUploaderOpen={() => setUploaderOpen(true)}
		user={user}
		handleLogout={handleLogout}

		onDeleteAll={handleDeleteAll}
		deleteAllProgress={progress}
	/>
}