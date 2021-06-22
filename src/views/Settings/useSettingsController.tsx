import ReactGA from "react-ga";
import { useCallback } from "react"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { useFeedbackOpenState } from "../../hooks/componentStates/useFeedbackOpenState";
import { useFileUploaderOpenState } from "../../hooks/componentStates/useFileUploaderOpenState";
import { useAvatarChangerMenuOpenState } from "../../hooks/componentStates/useAvatarChangerMenuOpenState";


export function useSettingsController() {
	const redirect = useRedirect()
	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)

	// Auth and logout
	const handleLogout = useCallback(async function () {
		const result = await logout()
		if (result.isSuccess()) {
			ReactGA.event({
				action: "Logout",
				category: "User",
			})
			redirect(_ => _.login)
		}
	}, [logout, redirect])

	// Subscribe
	const handleSubscribe = () => {
		redirect(_ => _.subscribe)
	}

	// Open drawers
	const { handleOpen: handleOpenFileUploader } = useFileUploaderOpenState()
	const { handleOpen: handleOpenFeedback } = useFeedbackOpenState()

	// Avatar changer menu state
	const avatarChangerMenu = useAvatarChangerMenuOpenState()

	// Feedback dialog state

	return {
		user,
		handleLogout,
		handleSubscribe,
		canManageBilling: !!user?.customer,
		avatarChangerMenu,
		handleOpenFileUploader,
		handleOpenFeedback,
	}
}