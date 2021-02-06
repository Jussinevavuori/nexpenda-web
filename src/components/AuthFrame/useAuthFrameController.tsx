import { usePwaInstall } from "../../hooks/application/usePwaInstall";

export function useAuthFrameController() {

	const handlePwaInstall = usePwaInstall()

	return { handlePwaInstall }

}