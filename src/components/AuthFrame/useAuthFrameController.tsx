import { usePwaInstall } from "../../hooks/usePwaInstall";

export function useAuthFrameController() {

	const handlePwaInstall = usePwaInstall()

	return { handlePwaInstall }

}