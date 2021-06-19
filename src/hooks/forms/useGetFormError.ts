import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

export function useGetFormError<T extends Object>(form: UseFormReturn<T>) {
  return useCallback(
    (field: keyof T) => {
      if (form.formState.touchedFields[field]) {
        const error = form.formState.errors[field];

        if (error && Array.isArray(error)) {
          return error.map((e) => e.message).join(", ");
        }

        if (error && "message" in error) {
          return error.message;
        }
      }
    },
    [form]
  );
}
