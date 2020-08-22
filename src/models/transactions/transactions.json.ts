import { object, string, number, ObjectSchema } from "yup";

const id = () => string();
const uid = () => string();
const integerAmount = () => number().integer();
const time = () => number().positive().integer();
const category = () => string().min(1);
const comment = () => string();

export type JsonTransaction = {
  id: string;
  uid: string;
  time: number;
  category: string;
  integerAmount: number;
  comment?: string | undefined;
};

export const jsonTransactionSchema: ObjectSchema<JsonTransaction> = object({
  id: id().required(),
  uid: uid().required(),
  time: time().required(),
  category: category().required(),
  integerAmount: integerAmount().required(),
  comment: comment(),
}).required();

export function isJsonTransaction(arg: any): arg is JsonTransaction {
  try {
    jsonTransactionSchema.validateSync(arg);
    return true;
  } catch (error) {
    return false;
  }
}

export function isJsonTransactionArray(arg: any): arg is JsonTransaction[] {
  return Array.isArray(arg) && arg.every(isJsonTransaction);
}
