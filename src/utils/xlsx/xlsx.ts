import { Failure, Result } from "../Result/Result";
import { JsonTransaction } from "../../classes/Transaction";
import XLSX from "xlsx";
import {
  readFileAsText,
  ReadFileAsTextFailureType,
} from "../readFileAsText/readFileAsText";

export type ReadFileAsJsonTransactionsFailureType =
  | (Error | undefined)
  | ReadFileAsTextFailureType;

export type ReadFileAsJsonTransactionsResult = Result<
  JsonTransaction[],
  ReadFileAsJsonTransactionsFailureType
>;

export async function readFileAsJsonTransactions(
  fileInputElement: HTMLInputElement
): Promise<ReadFileAsJsonTransactionsResult> {
  try {
    const raw = await readFileAsText(fileInputElement);

    if (raw.isFailure()) {
      return new Failure<
        JsonTransaction[],
        ReadFileAsJsonTransactionsFailureType
      >(raw.value, raw.details);
    }

    const workbook = XLSX.read(raw);

    console.log(workbook);

    return Failure.Unimplemented<JsonTransaction[]>();
  } catch (e) {
    if (e instanceof Error) {
      return Failure.Error<JsonTransaction[]>(e);
    } else {
      return Failure.Unknown<JsonTransaction[]>();
    }
  }
}
