import React, { useState } from "react";
import { useStoreState } from "../../store";
import { CategorySelectorDialogProps } from "./CategorySelectorDialog";

export function useCategorySelectorDialogController(
  props: CategorySelectorDialogProps
) {
  const categories = useStoreState((_) => _.transactions.categories);

  const [search, setSearch] = useState("");
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  const filteredCategories = categories.filter((category) => {
    return category.name.toLowerCase().includes(search.toLowerCase());
  });

  return {
    search,
    handleSearchChange,

    categories: filteredCategories,
  };
}
