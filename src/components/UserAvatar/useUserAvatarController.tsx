import { useEffect, useRef, useState } from "react"
import { useStoreState } from "../../store"
import { UserAvatarProps } from "./UserAvatar"

export function useUserAvatarController(props: UserAvatarProps) {

	const user = useStoreState(_ => _.auth.user)

	/**
	 * The current avatar and its state.
	 */
	const [avatar, setAvatar] = useState<
		{ type: "unset", src: undefined }
		| { type: "set", src: string | undefined }
		| { type: "error", src: undefined }
	>({ type: "unset", src: undefined })

	/**
	 * Memorize latest set URL in order to prevent sending multiple
	 * request to erroring URL
	 */
	const latestSrc = useRef<string>("")

	useEffect(function setLatestSrc() {
		if (avatar.src) {
			latestSrc.current = avatar.src;
		}
	}, [avatar, latestSrc])

	/**
	 * Initialize photo URL from user.
	 */
	useEffect(function initPhotoUrl() {

		// When no user, set to unset
		if (!user) {
			if (avatar.type !== "unset") {
				setAvatar({ type: "unset", src: undefined })
			}
			return
		}

		// When user, set to user's photo URL
		if (user.photoUrl !== latestSrc.current) {
			setAvatar({ type: "set", src: user.photoUrl })
		}
	}, [user, setAvatar, avatar])


	/**
	 * Set to error state when image loading gives error
	 */
	function handleImageLoadError() {
		setAvatar({ type: "error", src: undefined })
	}

	return { user, avatar, handleImageLoadError }

}