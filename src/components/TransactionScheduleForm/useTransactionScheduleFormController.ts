import emojiRegex from "emoji-regex";
import { z } from "zod";
import { useCallback, useEffect, useRef, useMemo } from "react";
import { useCalculatorOpenState } from "../../hooks/componentStates/useCalculatorOpenState";
import { useControlledForm } from "../../hooks/forms/useControlledForm";
import { useControlledFormField } from "../../hooks/forms/useControlledFormField";
import { useStoreActions, useStoreState } from "../../store";
import {
  defaultScheduleFormField,
  scheduleFormFieldSchema,
} from "../../lib/Forms/scheduleFormField";
import { TransactionScheduleFormProps } from "./TransactionScheduleForm";
import { Category } from "../../lib/DataModels/Category";
import { getErrorMessage } from "../../lib/ErrorMessages/getErrorMessage";
import { useEmojiPickerOpenState } from "../../hooks/componentStates/useEmojiPickerOpenState";

export const transactionScheduleFormSchema = z.object({
  icon: z
    .string()
    .refine(
      (str) => !str.trim() || emojiRegex().test(str.trim()),
      "Invalid icon"
    ),
  sign: z.enum(["+", "-"]),
  amount: z.string().regex(/^\+?-?\d*[.,]?\d{0,2}$/),
  category: z.string().refine((str) => !!str.trim()),
  firstOccurrence: z.date(),
  comment: z.string(),
  schedule: scheduleFormFieldSchema,
  updateAllTransactions: z.boolean(),
});

export type TransactionScheduleFormSchema = z.TypeOf<
  typeof transactionScheduleFormSchema
>;

export function useTransactionScheduleFormController(
  props: TransactionScheduleFormProps
) {
  const editSchedule = props.editTransactionSchedule;

  const categories = useStoreState((_) => _.transactions.categories);
  const notify = useStoreActions((_) => _.notification.notify);
  const postSchedule = useStoreActions((_) => _.schedules.postSchedule);
  const patchSchedule = useStoreActions((_) => _.schedules.patchSchedule);

  /**
   * Form state
   */
  const form = useControlledForm<TransactionScheduleFormSchema>({
    fields: {
      icon: useControlledFormField({
        defaultValue: "",
        validation: transactionScheduleFormSchema.shape.icon,
      }),
      sign: useControlledFormField({
        defaultValue: "-",
        validation: transactionScheduleFormSchema.shape.sign,
      }),
      amount: useControlledFormField({
        defaultValue: "",
        validation: transactionScheduleFormSchema.shape.amount,
      }),
      category: useControlledFormField({
        defaultValue: "",
        validation: transactionScheduleFormSchema.shape.category,
      }),
      firstOccurrence: useControlledFormField({
        defaultValue: new Date(),
        validation: transactionScheduleFormSchema.shape.firstOccurrence,
      }),
      comment: useControlledFormField({
        defaultValue: "",
        validation: transactionScheduleFormSchema.shape.comment,
      }),
      schedule: useControlledFormField({
        defaultValue: defaultScheduleFormField,
        validation: transactionScheduleFormSchema.shape.schedule,
      }),
      updateAllTransactions: useControlledFormField({
        defaultValue: false,
        validation: transactionScheduleFormSchema.shape.updateAllTransactions,
      }),
    },
  });

  /**
   * Open states
   */
  const emojiPicker = useEmojiPickerOpenState();
  const calculator = useCalculatorOpenState();

  /**
   * Calculator submission handler
   */
  const onCalculatorSubmit = useCallback(
    (value: number) => {
      calculator.handleClose();
      if (!Number.isNaN(value)) {
        form.set("sign", value <= 0 ? "-" : "+");
        form.set("amount", value.toFixed(2));
        setTimeout(() => {
          document.getElementById("amountInput")?.focus();
        }, 10);
      }
    },
    [calculator, form]
  );

  /**
   * Return an existing category if one found
   */
  const existingCategory = useMemo(() => {
    return categories.find((_) => _.value === form.values.category);
  }, [form, categories]);

  /**
   * If editing, initialize the state from edit transaction. We use
   * `latestEditTransactionId` for preventing double-initializations of
   * the same transaction.
   */
  const latestEditId = useRef<string>("");
  useEffect(() => {
    // Skip when not editing transaction
    if (!editSchedule) return;

    // Skip duplicate initialization of same editable transaction
    if (latestEditId.current === editSchedule.id) return;

    // Memorize ID as latest edit transaction ID
    latestEditId.current = editSchedule.id;

    // Initialize values
    form.set(
      "sign",
      editSchedule.transactionTemplate.amount.sign === 1 ? "+" : "-"
    );
    form.set(
      "amount",
      editSchedule.transactionTemplate.amount.decimalValue.toFixed(2)
    );
    form.set("category", editSchedule.transactionTemplate.category.value);
    form.set("comment", editSchedule.transactionTemplate.comment ?? "");
    form.set("firstOccurrence", editSchedule.schedule.firstOccurrence);
    form.set("schedule", {
      enabled: true,
      type: editSchedule.schedule.interval.type,
      every: editSchedule.schedule.interval.every,
      occurrences: editSchedule.schedule.occurrences ?? 1,
      occurrencesEnabled: false,
    });
  }, [editSchedule, form]);

  /**
   * Render option with icon in list
   */
  function optionRenderer(categoryValue: string) {
    const categoryObject = categories.find((_) => _.value === categoryValue);
    if (categoryObject) {
      return categoryObject.getFullLabel(form.values.sign);
    }
    const icon =
      form.values.sign === "+"
        ? Category.defaultIncomeIcon
        : Category.defaultExpenseIcon;
    return `${icon} ${categoryValue}`;
  }

  /**
   * Form submission
   */
  const handleFormSubmit = form.createSubmitHandler(async (formresult) => {
    if (!formresult.isValid) {
      form.setSubmitError("Invalid values.");
      notify({ message: "Could not create transaction", severity: "error" });
      return false;
    }

    // Parse values and put into format for posting to server
    const values = formresult.values;
    const integerAmount = parseInputToIntegerAmount(values.amount, values.sign);

    // Send create or edit request
    const result = editSchedule
      ? await patchSchedule({
          id: editSchedule.id,
          updateAllTransactions: values.updateAllTransactions,
          transactionTemplate: {
            integerAmount,
            category: values.category.trim() ?? null,
            comment: values.comment.trim(),
            categoryIcon: values.icon || undefined,
          },
          schedule: {
            firstOccurrence: values.firstOccurrence.getTime(),
            occurrences: values.schedule.occurrencesEnabled
              ? values.schedule.occurrences
              : null,
            interval: {
              type: values.schedule.type,
              every: values.schedule.every,
            } as JsonSchedule["interval"],
          },
        })
      : await postSchedule({
          transactionTemplate: {
            integerAmount,
            category: values.category.trim() ?? undefined,
            comment: values.comment.trim(),
            categoryIcon: values.icon || undefined,
          },
          schedule: {
            firstOccurrence: values.firstOccurrence.getTime(),
            occurrences: values.schedule.occurrencesEnabled
              ? values.schedule.occurrences
              : undefined,
            interval: {
              type: values.schedule.type,
              every: values.schedule.every,
            } as JsonSchedule["interval"],
          },
        });

    // In case of success, notify on edit and reset form
    if (result.isSuccess()) {
      if (editSchedule) {
        notify({ message: "Changes saved", severity: "success" });
      }

      form.reset();
      latestEditId.current = "";
      props.onClose?.();
      return true;
    } else {
      // Handle error messages
      if (
        result.reason === "network" &&
        result.code === "request/invalid-request-data"
      ) {
        const getError = (field: string) => {
          const e = result.data?.errors ?? {};
          const f = e[field];
          return f && typeof f === "string" ? f : undefined;
        };
        const attemptSetError = (
          field: keyof TransactionScheduleFormSchema
        ) => {
          const msg = getError(field);
          if (msg) form.setError(field, msg);
        };
        attemptSetError("amount");
        attemptSetError("comment");
        attemptSetError("category");
        attemptSetError("firstOccurrence");
        if (getError("_root")) {
          form.setSubmitError(getError("_root"));
        }
      } else {
        form.setSubmitError(getErrorMessage("transactionForm", result));
      }
      return false;
    }
  });

  return {
    form,
    handleFormSubmit,
    existingCategory,
    calculator,
    onCalculatorSubmit,
    emojiPicker,
    categories,
    isEditing: !!editSchedule,
    optionRenderer,
  };
}

/**
 * Parses a numeric input to an integer amount.
 */
function parseInputToIntegerAmount(amount: string, signStr: "+" | "-"): number {
  const parsedString = amount.trim().replace(/,/g, ".");
  const parsedNumber = 100 * parseFloat(parsedString);
  const parsedInteger = Math.round(Math.abs(parsedNumber));
  const sign = signStr === "+" ? 1 : -1;
  return parsedInteger * sign;
}
