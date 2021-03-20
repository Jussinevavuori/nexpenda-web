import { Failure } from "./Failure";

export class SpreadsheetReadRowFailure<T> extends Failure<
  T,
  "spreadsheet-read-row-failure"
> {
  constructor() {
    super("spreadsheet-read-row-failure", { silent: true });
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

export class SpreadsheetNoFileCreatedFailure<T> extends Failure<
  T,
  "spreadsheet-no-file-created"
> {
  constructor() {
    super("spreadsheet-no-file-created");
  }
}
