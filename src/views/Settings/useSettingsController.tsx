import ReactGA from "react-ga";
import { useCallback } from "react"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { useFeedbackDialogOpenState } from "../../components/FeedbackDialog/useFeedbackDialogController";
import { useFileUploaderDrawerOpenState } from "../../components/FileUploaderDrawer/useFileUploaderDrawerController";


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
	const [, setIsFileUploaderDrawerOpen] = useFileUploaderDrawerOpenState()
	const handleOpenFileUploaderDrawer = useCallback(() => {
		setIsFileUploaderDrawerOpen(true)
	}, [setIsFileUploaderDrawerOpen])

	// Feedback dialog state
	const [, setIsFeedbackDialogOpen] = useFeedbackDialogOpenState()
	const handleOpenFeedbackDialog = useCallback(() => {
		setIsFeedbackDialogOpen(true)
	}, [setIsFeedbackDialogOpen])

	return {
		user,
		handleLogout,
		handleSubscribe,
		canManageBilling: !!user?.customer,
		handleOpenFileUploaderDrawer,
		handleOpenFeedbackDialog,
	}
}