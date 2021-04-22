import { useRedirect } from "../utils/useRedirect";
import { useShortcut } from "./useShortcut";

/**
 * Alt + [1,2,3,4] will automatically switch the tab for the current user.
 */
export function useSelectTabShortcuts() {
  const redirect = useRedirect();

  useShortcut({ key: "1", alt: true }, () => redirect((_) => _.dashboard));
  useShortcut({ key: "2", alt: true }, () => redirect((_) => _.analytics));
  useShortcut({ key: "3", alt: true }, () => redirect((_) => _.budgets));
  useShortcut({ key: "4", alt: true }, () => redirect((_) => _.settings));
}
