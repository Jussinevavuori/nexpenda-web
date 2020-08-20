import * as yup from "yup";

export const transactionConstructableSchema = yup
  .object({
    uid: yup.string().defined(),
    date: yup.number().defined(),
    category: yup.string().defined(),
    integerAmount: yup.number().defined().integer(),
    comment: yup.string().optional().nullable(),
    id: yup.string().optional().nullable(),
  })
  .defined();

export type TransactionConstructable = yup.InferType<
  typeof transactionConstructableSchema
>;

export function isTransactionConstructable(
  arg: any
): arg is TransactionConstructable {
  try {
    transactionConstructableSchema.validateSync(arg);
    return true;
  } catch (error) {
    return false;
  }
}

export function isTransactionConstructableArray(
  arg: any
): arg is TransactionConstructable[] {
  return Array.isArray(arg) && arg.every(isTransactionConstructable);
}
