import { useOpenMenuQueryState } from "../state/useOpenMenuQueryState";
import { ComponentState } from "./ComponentState";

export function useEmojiPickerOpenState() {
  return useOpenMenuQueryState(ComponentState.keys.EmojiPicker);
}
