import { useFileUploaderOpenState } from "../../hooks/componentStates/useFileUploaderOpenState";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { FileUploaderDrawerProps } from "./FileUploaderDrawer";

export function useFileUploaderDrawerController(
  props: FileUploaderDrawerProps
) {
  const { isOpen, handleClose } = useFileUploaderOpenState();
  const isDesktop = useMdMedia();

  return {
    isDesktop,
    isOpen,
    handleClose,
  };
}
