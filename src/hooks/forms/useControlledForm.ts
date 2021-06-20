import React, { useMemo, useCallback, useState } from "react";
import { forEach } from "../../utils/DataUtils/forEach";
import { mapObject } from "../../utils/DataUtils/mapObject";
import { reduceObject } from "../../utils/DataUtils/reduceObject";
import { ControlledFormField } from "./useControlledFormField";

export type UseControlledFormOptions<T extends {}> = {
  fields: { [K in keyof T]: ControlledFormField<T[K]> };
};

export function useControlledForm<T extends {}>(
  options: UseControlledFormOptions<T>
) {
  // Destructure fields
  const fields = options.fields;

  // Get all field values
  const values = useMemo(() => {
    return mapObject(fields, (_, f) => f.value) as T;
  }, [fields]);

  // Get all field errors
  const errors = useMemo(() => {
    return mapObject(fields, (_, f) => f.error);
  }, [fields]);

  // Is form valid
  const isValid = useMemo(() => {
    return reduceObject(fields, (valid, f) => valid && f.isValid, true);
  }, [fields]);

  // Submission error state
  const [submitError, setSubmitError] = useState<string>();

  // Form status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"failure" | "success">();
  const isSubmitSuccesful = useMemo(
    () => submitStatus === "success",
    [submitStatus]
  );
  const isSubmitFailure = useMemo(
    () => submitStatus === "failure",
    [submitStatus]
  );

  // Reset form callback
  const reset = useCallback(() => {
    forEach(fields, (field) => field.reset());
    setSubmitError(undefined);
  }, [fields]);

  // Set value
  const set = useCallback(
    (key: keyof T, value: T[typeof key]) => {
      fields[key].onChange(value);
    },
    [fields]
  );

  // Set error
  const setError = useCallback(
    (key: keyof T, value: string | undefined) => {
      fields[key].setError(value);
    },
    [fields]
  );

  // Create a submit handler
  const createSubmitHandler = useCallback(
    (
      onSubmit: (
        formResult:
          | { isValid: true; values: typeof values }
          | { isValid: false; errors: typeof errors }
      ) => Promise<boolean>
    ) => {
      return async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        const success = await onSubmit(
          isValid ? { isValid, values: values } : { isValid, errors: errors }
        );
        setSubmitStatus(success ? "success" : "failure");
        if (success) {
          reset();
        }
        setIsSubmitting(false);
      };
    },
    [values, errors, isValid, setIsSubmitting, setSubmitStatus, reset]
  );

  return {
    fields,
    values,
    errors,
    submitError,
    isValid,
    isSubmitting,
    isSubmitSuccesful,
    isSubmitFailure,
    setSubmitError,
    set,
    setError,
    reset,
    createSubmitHandler,
  };
}
