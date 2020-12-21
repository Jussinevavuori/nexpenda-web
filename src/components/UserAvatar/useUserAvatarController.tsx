import { useStoreState } from "../../store"
import { UserAvatarProps } from "./UserAvatar"

export function useUserAvatarController(props: UserAvatarProps) {

	const user = useStoreState(_ => _.auth.user)

	return { user }

}