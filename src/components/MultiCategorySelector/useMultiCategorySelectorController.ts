import { useStoreState } from "../../store";
import { MultiCategorySelectorProps } from "./MultiCategorySelector";

export function useMultiCategorySelectorController(
  props: MultiCategorySelectorProps
) {
  const categories = useStoreState((_) => _.transactions.categories);

  // Validate props
  if (!!props.onChange && !props.value) {
    throw new Error(
      "When providing an onChange handler to MultiCategorySelector, you must also provide a value."
    );
  } else if (!props.onChange && !!props.value) {
    throw new Error(
      "When providing a value to MultiCategorySelector, you must also provide an onChange handler."
    );
  }

  return {
    categories,
  };
}
