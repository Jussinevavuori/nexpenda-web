import { Ref, useCallback, useImperativeHandle, useRef, } from "react"
import { useHashOpenState } from "../../hooks/state/useHashOpenState"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { useStoreActions, useStoreState } from "../../store"
import { UserMenuProps } from "./UserMenu"

export type UserMenuRef = {
	open(e: React.MouseEvent<HTMLElement>): void;
}

export const UserMenuOpenHash = "usermenu"

export function useUserMenuOpenState() {
	return useHashOpenState(UserMenuOpenHash)
}

export function useUserMenuController(props: UserMenuProps, ref: Ref<UserMenuRef>) {

	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)
	const notify = useStoreActions(_ => _.notification.notify)
	const redirect = useRedirect()

	// Open state
	const [open, setOpen] = useUserMenuOpenState()

	// Latest anchor
	const anchor = useRef<HTMLElement | null>(null)

	// Close function
	const handleClose = useCallback(() => {
		anchor.current = null
		setOpen(false)
	}, [anchor, setOpen])

	// Open function
	const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
		anchor.current = e.currentTarget
		setOpen(true)
	}, [anchor, setOpen])

	// Expose the opening function to a parent component
	useImperativeHandle(ref, (): UserMenuRef => ({
		open: handleOpen
	}))

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
		open,
		setOpen,
		anchor,
		handleClose,
		handleOpen,
		user,
		handleSettings,
		handleLogout,
	}

}