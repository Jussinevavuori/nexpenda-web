import { useState, useMemo, useCallback } from "react";
import { z } from "zod";

export type ControlledFormFieldOptions<FieldType> = {
  defaultValue: FieldType;
  validation: z.Schema<FieldType>;
  hideErrorOnUntouched?: boolean;
};

export type ControlledFormField<FieldType> = {
  value: FieldType;
  isTouched: boolean;
  isDirty: boolean;
  error: string | undefined;
  isValid: boolean;
  onChange: (nextValue: FieldType) => void;
  setError: (message: string | undefined) => void;
  onBlur: () => void;
  reset: () => void;
};

export function useControlledFormField<FieldType>(
  options: ControlledFormFieldOptions<FieldType>
): ControlledFormField<FieldType> {
  // Destructure options with default values
  const defaultValue = options.defaultValue;
  const validation = options.validation;
  const hideErrorOnUntouched = options.hideErrorOnUntouched ?? true;

  // Form field state
  const [value, setValue] = useState<FieldType>(defaultValue);
  const [isTouched, setIsTouched] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Is valid
  const isValid = useMemo(() => {
    return validation.safeParse(value).success;
  }, [validation, value]);

  // User specified custom error
  const [customError, setError] = useState<string>();

  // Error message
  const error = useMemo(() => {
    if (customError) return customError;

    if (hideErrorOnUntouched && !isTouched) return undefined;

    const validated = validation.safeParse(value);
    if (validated.success) return undefined;
    return validated.error.issues.map((_) => _.message).join(", ");
  }, [customError, hideErrorOnUntouched, validation, isTouched, value]);

  // On change handler
  const onChange = useCallback(
    (nextValue: FieldType) => {
      setIsDirty(true);
      setValue(nextValue);
    },
    [setValue, setIsDirty]
  );

  // On blur createSubmitHandler
  const onBlur = useCallback(() => {
    setIsTouched(true);
  }, [setIsTouched]);

  // Reset handler
  const reset = useCallback(() => {
    setValue(defaultValue);
    setIsTouched(false);
    setIsDirty(false);
  }, [setValue, setIsTouched, setIsDirty, defaultValue]);

  return {
    value,
    isTouched,
    isDirty,
    error,
    isValid,
    setError,
    onChange,
    onBlur,
    reset,
  };
}
