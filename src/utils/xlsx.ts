import { Failure, Result } from "../classes/Result/Result";
import { JsonTransaction } from "../models/transactions/transactions.json";

export function readFileToJsonTransactions(): Result<JsonTransaction[]> {
  return Failure.Unimplemented();
}
