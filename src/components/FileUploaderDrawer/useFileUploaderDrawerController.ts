import { useBooleanQueryState } from "../../hooks/state/useBooleanQueryState";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { FileUploaderDrawerProps } from "./FileUploaderDrawer";


export const FileUploaderDrawerOpenStateKey = "uploadfile"


export function useFileUploaderDrawerOpenState() {
	return useBooleanQueryState(FileUploaderDrawerOpenStateKey, "push", "open")
}


export function useFileUploaderDrawerController(props: FileUploaderDrawerProps) {

	const [isOpen, setIsOpen] =useFileUploaderDrawerOpenState()
	const isDesktop = useMdMedia()

	return {
		isDesktop,
		isOpen,
		handleClose() { setIsOpen(false) },
	};

}