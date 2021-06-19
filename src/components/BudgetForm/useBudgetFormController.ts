import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Category } from "../../classes/Category";
import { useStoreActions, useStoreState } from "../../store";
import { BudgetFormProps } from "./BudgetForm";
import { useOpenState } from "../../hooks/state/useOpenState";

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
      message: "Amount is not a valid number",
    })
    .refine((value) => !!getIntegerAmount(value), {
      message: "Amount is not a valid number",
    }),
  periodMonths: z
    .string()
    .regex(/^\d+$/, { message: "Period is not a valid number" })
    .refine(
      (value) => {
        const float = parseFloat(value);
        const int = parseInt(value);
        return !!int && int === float;
      },
      { message: "Period must be an integer" }
    )
    .refine((value) => parseInt(value) > 0, {
      message: "Period must be a positive number",
    })
    .refine((value) => parseInt(value) <= 12, {
      message: "Period cannot be longer than 12 months",
    })
    .optional(),
});

export type BudgetFormType = z.TypeOf<typeof budgetValidationSchema>;

export function useBudgetFormController(props: BudgetFormProps) {
  const postBudget = useStoreActions((_) => _.budgets.postBudget);
  const putBudget = useStoreActions((_) => _.budgets.putBudget);
  const allCategories = useStoreState((_) => _.transactions.categories);

  // All selected categories
  const [categories, setCategories] = useState<Category[]>(
    props.variant.edit?.budget.getCategories(allCategories) ?? []
  );

  // Expansion state
  const expansion = useOpenState();

  // Is the form an expense or income budget?
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
    defaultValues: props.variant.edit
      ? {
          amount: props.variant.edit.budget.amount.decimalValue.toFixed(2),
          label: props.variant.edit.budget.customLabel,
          periodMonths: props.variant.edit.budget.periodMonths.toFixed(0),
        }
      : undefined,
  });

  // Submitting handler
  async function submitHandler(values: BudgetFormType) {
    setError(undefined);

    if (categories.length === 0) {
      setError("You haven't selected any categories");
      return;
    }

    // Parse integer amount
    const sign = variant === "income" ? 1 : -1;
    const integerAmount = getIntegerAmount(values.amount) * sign;

    // Parse period months
    let periodMonths = 1;
    try {
      if (values.periodMonths) {
        periodMonths = z
          .number()
          .int()
          .min(1)
          .max(12)
          .parse(parseInt(values.periodMonths));
      }
    } catch (e) {
      setError("Invalid period");
      return;
    }

    // Update or post
    const result = await (props.variant.edit?.budget
      ? putBudget({
          integerAmount,
          label: values.label,
          categoryIds: categories.map((_) => _.id),
          id: props.variant.edit.budget.id,
          periodMonths,
        })
      : postBudget({
          integerAmount,
          label: values.label,
          categoryIds: categories.map((_) => _.id),
          periodMonths,
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
    labelError:
      form.formState.touchedFields.label &&
      form.formState.errors.label?.message,
    amountError:
      form.formState.touchedFields.amount &&
      form.formState.errors.amount?.message,
    periodError:
      form.formState.touchedFields.periodMonths &&
      form.formState.errors.periodMonths?.message,

    expansion,

    variant,
    isEditing: !!props.variant.edit,

    categories,
    onCategoriesChange(newCategories: Category[]) {
      setCategories(newCategories);
    },
  };
}
