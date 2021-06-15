import ReactGA from "react-ga";
import { useCallback } from "react"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { ComponentState } from "../../hooks/componentStates/ComponentState";
import { useFeedbackDialogOpenState } from "../../hooks/componentStates/useFeedbackDialogOpenState";
import { useFileUploaderDrawerOpenState } from "../../hooks/componentStates/useFileUploaderDrawerOpenState";
import { useOpenStateWrapper } from "../../hooks/state/useOpenStateWrapper";
import { useQueryMenuState } from "../../hooks/state/useQueryMenuState";


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

	// Upload state
	const { handleOpen: handleOpenFileUploaderDrawer } = useOpenStateWrapper(
		useFileUploaderDrawerOpenState()
	)

	// Avatar changer menu state
	const avatarChangerMenu = useQueryMenuState(ComponentState.keys.AvatarChangerMenu, "push")

	// Feedback dialog state
	const { handleOpen: handleOpenFeedbackDialog } = useOpenStateWrapper(
		useFeedbackDialogOpenState()
	)

	return {
		user,
		handleLogout,
		handleSubscribe,
		canManageBilling: !!user?.customer,
		handleOpenFileUploaderDrawer,
		avatarChangerMenu,
		handleOpenFeedbackDialog,
	}
}