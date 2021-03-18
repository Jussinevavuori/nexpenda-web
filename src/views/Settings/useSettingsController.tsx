import ReactGA from "react-ga";
import { useCallback } from "react"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { useFeedbackDialogOpenState } from "../../components/FeedbackDialog/useFeedbackDialogController";


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
				action: "Logout",
				category: "User",
			})
			redirect(_ => _.login)
		}
	}, [logout, redirect])

	const handleSubscribe = () => {
		redirect(_ => _.subscribe)
	}

	/**
	 * Feedback dialog state
	 */
	const [, setIsFeedbackDialogOpen] = useFeedbackDialogOpenState()
	const handleOpenFeedbackDialog = useCallback(() => {
		setIsFeedbackDialogOpen(true)
	}, [setIsFeedbackDialogOpen])

	return {
		user,
		handleLogout,
		handleSubscribe,
		canManageBilling: !!user?.customer,
		handleOpenFeedbackDialog,
	}
}