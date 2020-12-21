import { useRef } from "react"
import { useStoreState } from "../../store"
import { UserMenuRef } from "../UserMenu/useUserMenuController"
import { UserManagerProps } from "./UserManager"

export function useUserManagerController(props: UserManagerProps) {

	const user = useStoreState(_ => _.auth.user)

	const userMenuRef = useRef<UserMenuRef | null>(null)

	return {
		user,
		userMenuRef
	}
}