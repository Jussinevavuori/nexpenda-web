import { useCallback } from "react"
import { useUserMenuOpenState } from "../../hooks/componentStates/useUserMenuOpenState"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { useStoreActions, useStoreState } from "../../store"
import { UserMenuProps } from "./UserMenu"

export function useUserMenuController(props: UserMenuProps) {

	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)
	const notify = useStoreActions(_ => _.notification.notify)
	const redirect = useRedirect()

	// Open state
	const { isOpen, handleOpen, handleClose, anchorEl } = useUserMenuOpenState()

	// Settings action
	const handleSettings = useCallback(() => {
		handleClose()
		redirect(_ => _.settings)
	}, [handleClose, redirect])

	// Logout action
	const handleLogout = useCallback(async () => {
		handleClose()
		const result = await logout()
		if (result.isFailure()) {
			notify({
				message: `Logout failed`,
				severity: "error"
			})
		} else {
			redirect(_ => _.login)
		}
	}, [logout, handleClose, redirect, notify])

	return {
		isOpen,
		anchorEl,
		handleClose,
		handleOpen,
		user,
		handleSettings,
		handleLogout,
	}

}