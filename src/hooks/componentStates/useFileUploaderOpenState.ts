import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useFileUploaderOpenState() {
  return useOpenQueryState(ComponentState.keys.FileUploader);
}
