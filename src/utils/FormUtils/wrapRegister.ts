import { useForm } from "react-hook-form";

export function wrapRegister(
  registration: ReturnType<ReturnType<typeof useForm>["register"]>,
  refName: string
): Omit<ReturnType<ReturnType<typeof useForm>["register"]>, "ref"> {
  const { ref, ...rest } = registration;
  return { [refName]: ref, ...rest };
}
