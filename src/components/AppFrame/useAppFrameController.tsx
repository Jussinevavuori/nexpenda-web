import { useStoreState } from "../../store"
import { AppFrameProps } from "./AppFrame"

export function useAppFrameController(props: AppFrameProps) {

	const initialized = useStoreState(_ => _.auth.initialized)

	return { initialized }
}