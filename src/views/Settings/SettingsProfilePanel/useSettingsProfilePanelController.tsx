import { useState, useCallback } from "react"
import { useStoreActions, useStoreState } from "../../../store"
import { SettingsProfilePanelProps } from "./SettingsProfilePanel"

export function useSettingsProfilePanelController(props: SettingsProfilePanelProps) {

	const updateProfile = useStoreActions(_ => _.auth.updateProfile)
	const notify = useStoreActions(_ => _.notification.notify)

	// Get the current user
	const user = useStoreState(_ => _.auth.user)

	// Editing state
	const editNameInputId = "SettingsProfilePanel__editNameInputId"

	const [editingName, setEditingName] = useState(false)
	const [loadingName, setLoadingName] = useState(false)
	const [nameValue, setNameValue] = useState("")

	const handleStartEditName = useCallback(() => {
		setEditingName(true)
		setNameValue(user?.displayName ?? "")
		setImmediate(() => {
			document.getElementById(editNameInputId)?.focus()
		})
	}, [setEditingName, user])

	const handleCancelEditName = useCallback(() => {
		setEditingName(false)
	}, [setEditingName])

	// Submitting the edit
	const handleSubmitName = useCallback(async () => {
		// Ensure a value is given
		if (nameValue.trim()) {

			// Start loading
			setLoadingName(true)

			// Update profile
			const result = await updateProfile({ displayName: nameValue })

			// Show message
			if (result.isFailure()) {
				notify({
					message: (() => {
						switch (result.reason) {
							case "invalidServerResponse":
								return "Invalid response from server."
							case "network":
								switch (result.code) {
									default:
										return result.message
								}
						}
					})(),
					severity: "error"
				})
			} else {
				notify({
					message: "Succesfully updated profile name",
					severity: "success"
				})
			}

			// End loading
			setLoadingName(false)
		}
		handleCancelEditName()
	}, [handleCancelEditName, updateProfile, notify, nameValue])

	return {
		editNameInputId,
		user,
		name: {
			editing: editingName,
			handleStartEdit: handleStartEditName,
			handleCancelEdit: handleCancelEditName,
			handleSubmit: handleSubmitName,
			value: nameValue,
			setValue: setNameValue,
			loading: loadingName,
			setLoading: setLoadingName,
		}
	}
}