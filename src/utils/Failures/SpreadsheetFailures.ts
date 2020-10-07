import { Failure } from "../Result/Result";

export class SpreadsheetReadRowFailure<T> extends Failure<
  T,
  "spreadsheet-read-row-failure"
> {
  constructor() {
    super("spreadsheet-read-row-failure");
  }
}

export class SpreadsheetReadFileFailure<T> extends Failure<
  T,
  "spreadsheet-read-file-failure"
> {
  constructor() {
    super("spreadsheet-read-file-failure");
  }
}
