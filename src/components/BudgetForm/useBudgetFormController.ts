import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Category } from "../../classes/Category";
import { useStoreActions, useStoreState } from "../../store";
import { BudgetFormProps } from "./BudgetForm";

function getIntegerAmount(value: string | number) {
  if (typeof value === "number") {
    return Math.floor(Math.abs(value * 100));
  }
  const valid = /^-?\d*[.,]?\d{0,2}$/.test(value.trim());
  if (!valid) {
    return NaN;
  }
  return Math.floor(Math.abs(100 * Number(value.trim().replace(/,/g, "."))));
}

export const budgetValidationSchema = z.object({
  label: z.string().optional(),
  amount: z
    .string()
    .regex(/^-?\d*[.,]?\d{0,2}$/, {
      message: "Amount is not a valid number REGEX",
    })
    .refine(
      (value) => {
        const int = getIntegerAmount(value);
        return !!int;
      },
      { message: "Amount is not a valid number INT" }
    ),
});

export type BudgetFormType = z.TypeOf<typeof budgetValidationSchema>;

export function useBudgetFormController(props: BudgetFormProps) {
  const categories = useStoreState((_) => _.transactions.categories);
  const postBudget = useStoreActions((_) => _.budgets.postBudget);
  const putBudget = useStoreActions((_) => _.budgets.putBudget);

  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isSelectingCategory, setIsSelectingCategory] = useState(false);

  function handleSelectCategory() {
    setIsSelectingCategory(true);
  }

  function handleCancelSelectCategory() {
    setIsSelectingCategory(false);
  }

  function onCategorySelected(category: Category) {
    setCategoryIds((_) => _.concat(category.id));
    setIsSelectingCategory(false);
  }

  function handleRemoveCategory(category: Category) {
    setCategoryIds((_) => _.filter((_) => _ !== category.id));
  }

  const selectedCategories = useMemo(() => {
    const _categories: Category[] = [];
    categories.forEach((category) => {
      if (categoryIds.includes(category.id)) {
        _categories.push(category);
      }
    });
    return _categories;
  }, [categoryIds, categories]);

  const variant = props.variant.edit
    ? props.variant.edit.budget.isExpense
      ? "expense"
      : "income"
    : props.variant.create.variant;

  // Submit error
  const [error, setError] = useState<string>();

  // Form
  const form = useForm<BudgetFormType>({
    resolver: zodResolver(budgetValidationSchema),
  });

  // Submitting handler
  async function submitHandler(values: BudgetFormType) {
    setError(undefined);

    if (categoryIds.length === 0) {
      setError("You haven't selected any categories");
      return;
    }

    const sign = variant === "income" ? 1 : -1;

    // Update or post
    const result = await (props.variant.edit?.budget
      ? putBudget({
          integerAmount: getIntegerAmount(values.amount) * sign,
          label: values.label,
          categoryIds,
          id: props.variant.edit.budget.id,
        })
      : postBudget({
          integerAmount: getIntegerAmount(values.amount) * sign,
          label: values.label,
          categoryIds,
        }));

    /**
     *  On success redirect
     */
    if (result.isSuccess()) {
      if (props.onSubmitted) {
        props.onSubmitted();
      }
      return;
    }

    /**
     * Else display correct error message
     */

    setError(() => {
      switch (result.reason) {
        case "invalidServerResponse":
          return "Invalid response received from server.";
        case "network":
          switch (result.code) {
            case "request/too-many-requests":
              return "You are trying too fast! Try again later.";
            case "request/invalid-request-data":
              return "Invalid data.";
            case "server/unavailable":
              return "Could not contact server. Try again later.";
            default:
              return "An error occured while logging in. Try again.";
          }
        default:
          return "An unknown error occured. Try again later.";
      }
    });
  }

  return {
    form,
    error,
    handleSubmit: form.handleSubmit(submitHandler),
    labelError: form.formState.touched.label && form.errors.label?.message,
    amountError: form.formState.touched.amount && form.errors.amount?.message,

    variant,
    isEditing: !!props.variant.edit,

    selectedCategories,
    handleCancelSelectCategory,
    handleRemoveCategory,
    onCategorySelected,
    handleSelectCategory,
    isSelectingCategory,
  };
}
