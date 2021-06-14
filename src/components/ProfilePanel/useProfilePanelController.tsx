import ReactGA from "react-ga";
import { useState, useCallback } from "react"
import { useStoreActions, useStoreState } from "../../store"
import { ProfilePanelProps } from "./ProfilePanel"
import { getErrorMessage } from "../../utils/ErrorMessage/getErrorMessage";

export function useProfilePanelController(props: ProfilePanelProps) {

	const updateProfile = useStoreActions(_ => _.auth.updateProfile)
	const notify = useStoreActions(_ => _.notification.notify)

	// Get the current user
	const user = useStoreState(_ => _.auth.user)

	// Editing state
	const editNameInputId = "ProfilePanel__editNameInputId"

	const [editingName, setEditingName] = useState(false)
	const [loadingName, setLoadingName] = useState(false)
	const [nameValue, setNameValue] = useState("")

	const handleStartEditName = useCallback(() => {
		setEditingName(true)
		setNameValue(user?.displayName ?? "")
		setTimeout(() => {
			const element = document.getElementById(editNameInputId)
			if (element) {
				element.focus()
			}
		}, 0)
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
				ReactGA.event({
					action: "Change Profile Name",
					category: "Profile",
				})
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

	const forgotPassword = useStoreActions(_ => _.auth.forgotPassword)
	const handleChangePassword = useCallback(async () => {
		if (!user || !user.email || !user.hasPassword) return
		const result = await forgotPassword({ email: user.email })
		if (result.isSuccess()) {
			notify({ message: "Password change email sent", severity: "success" })
		} else {
			notify({
				message: getErrorMessage("forgotPassword", result),
				severity: "error",
			})
		}
	}, [notify, forgotPassword, user])

	const manageSubscription = useStoreActions(_ => _.stripe.createBillingPortalSession)

	return {
		editNameInputId,
		user,
		handleChangePassword,
		async handleManageSubscription() {
			manageSubscription()
		},
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