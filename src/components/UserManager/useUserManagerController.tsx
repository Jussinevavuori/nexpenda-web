import { useUserMenuOpenState } from "../../hooks/componentStates/useUserMenuOpenState"
import { useStoreState } from "../../store"
import { UserManagerProps } from "./UserManager"

export function useUserManagerController(props: UserManagerProps) {

	const user = useStoreState(_ => _.auth.user)

	const userMenu = useUserMenuOpenState()

	return {
		user,
		userMenu,
	}
}