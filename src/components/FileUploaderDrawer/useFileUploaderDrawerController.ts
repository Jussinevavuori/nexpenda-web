import { useFileUploaderDrawerOpenState } from "../../hooks/componentStates/useFileUploaderDrawerOpenState";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { FileUploaderDrawerProps } from "./FileUploaderDrawer";

export function useFileUploaderDrawerController(
  props: FileUploaderDrawerProps
) {
  const [isOpen, setIsOpen] = useFileUploaderDrawerOpenState();
  const isDesktop = useMdMedia();

  return {
    isDesktop,
    isOpen,
    handleClose() {
      setIsOpen(false);
    },
  };
}
