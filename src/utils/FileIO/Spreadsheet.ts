import XLSX from "xlsx";
import * as yup from "yup";
import { Failure } from "../../result/Failure";
import { ErrorFailure } from "../../result/GenericFailures";
import {
  SpreadsheetNoFileCreatedFailure,
  SpreadsheetReadFileFailure,
  SpreadsheetReadRowFailure,
} from "../../result/SpreadsheetFailures";
import { Success } from "../../result/Success";
import { FileIO } from "./FileIO";

export type SpreadsheetReadFileResult<T> = {
  rows: T[];
  succeeded: number;
  failed: number;
  total: number;
};

export abstract class Spreadsheet<T extends object> {
  /**
   * The latest created file for downloading
   */
  private _workbook?: XLSX.WorkBook;

  /**
   * Rows count
   */
  protected _rowsCount: number = 0;

  /**
   * Escpaes a filename: removes unwanted characters and slices to
   * wanted length
   */
  static escapeFileName(name: string, filetype?: string) {
    /* eslint-disable no-useless-escape */
    return name
      .replace(/[\:\\\/\?\*\[\]]/g, "")
      .slice(0, 29 - (filetype?.length ?? 0))
      .concat(filetype ? "." + filetype : "");
  }

  /**
   * The schema (must be implemented by implementing class)
   */
  public abstract schema: yup.ObjectSchema<T>;

  /**
   * Options for spreadsheet (must be implemented by implementing class)
   */
  public abstract options: {
    [C in keyof T]: {
      names: string[];
      transformBeforeValidation?: (value: any) => any;
    };
  };

  /**
   * Parses and validates a single row
   */
  private async parseRow(row: any) {
    if (typeof row !== "object" || !row) {
      return new SpreadsheetReadRowFailure<T>();
    }
    try {
      const transformed: { [C in keyof T]?: any } = {};
      Object.keys(this.options).forEach((key) => {
        const options = this.options[key as keyof T];
        const columnKey = Object.keys(row).find((_) => {
          return options.names
            .map((_) => _.toLowerCase())
            .includes(_.toLowerCase());
        });
        if (columnKey) {
          const columnValue = row[columnKey];
          transformed[key as keyof T] = options.transformBeforeValidation
            ? options.transformBeforeValidation(columnValue)
            : columnValue;
        }
      });
      const validation = await this.schema.validate(transformed);
      return new Success(validation);
    } catch (e) {
      return new ErrorFailure<T>(e, { silent: true });
    }
  }

  /**
   * Takes a HTML input (input) and reads a file from it. On file upload,
   * parses the file to an arraybuffer, then an XLSX workbook, from which
   * it parses all the rows to objects and returns all the succesfully
   * parsed rows.
   *
   * @param input HTMLInputElement (with type of file)
   */
  async readFile(input: HTMLInputElement) {
    try {
      // Parse as text
      const arrayBuffer = await FileIO.readFileAsArrayBuffer(input);
      if (arrayBuffer.isFailure()) {
        return new SpreadsheetReadFileFailure<SpreadsheetReadFileResult<T>>();
      }

      // Create workbook and read to JSON
      const workbook = XLSX.read(arrayBuffer.value, { type: "buffer" });
      this._workbook = workbook;
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { raw: true });

      // Parse rows
      const rowParsers = json.map((row) => this.parseRow(row));
      const parsedRows = await Promise.all(rowParsers);
      const succeededRows = Success.All(parsedRows);
      const failedRows = Failure.All(parsedRows);

      // Warn on failed rows
      if (failedRows.length > 0) {
        console.warn(`Failed parsing ${failedRows.length} rows`, failedRows);
      }

      // Return succeeded rows and count of failed rows
      return new Success<SpreadsheetReadFileResult<T>>({
        rows: succeededRows.map((_) => _.value),
        succeeded: succeededRows.length,
        failed: failedRows.length,
        total: succeededRows.length + failedRows.length,
      });
    } catch (error) {
      return new ErrorFailure<SpreadsheetReadFileResult<T>>(error, {
        silent: true,
      });
    }
  }

  /**
   * Function to convert a row into a JSON object for downloading. Must
   * be implemented by an extending class.
   */
  protected abstract createRow(row: T): object;

  /**
   * Function to sort rows. Must be implemented by an extending class.
   */
  protected abstract sortRows(rows: T[]): T[];

  /**
   * Function to generate a name for the created file. Must be implemented
   * by an extending class.
   */
  protected abstract getFileName(): string;

  /**
   * Function to generate a name for the sheet of the created file. Must be
   * implemented by an extending class.
   */
  protected abstract getFileSheetName(): string;

  /**
   * Gets number of rows
   */
  getRowsCount(): number {
    return this._rowsCount;
  }

  /**
   * Generates a spreadsheet for downloading
   */
  createFile(rows: T[]) {
    /**
     * Create new book
     */
    const workbook = XLSX.utils.book_new();

    /**
     * Update rows count
     */
    this._rowsCount = rows.length;

    /**
     * Sort rows and map to objects of wanted shape
     */
    const sortedRows = this.sortRows(rows);
    const createdRows = sortedRows.map((row) => this.createRow(row));

    /**
     * Create worksheet from mapped and sorted rows and add to workbook
     */
    const worksheet = XLSX.utils.json_to_sheet(createdRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, this.getFileSheetName());

    /**
     * Save workbook
     */
    this._workbook = workbook;
  }

  /**
   * Downloads a created file
   */
  downloadFile() {
    /**
     * Ensure a workbook exists
     */
    if (!this._workbook) {
      return new SpreadsheetNoFileCreatedFailure<void>();
    }

    /**
     * Download file
     */
    const filename = Spreadsheet.escapeFileName(this.getFileName(), "xlsx");
    XLSX.writeFile(this._workbook, filename);
    return Success.Empty();
  }

  /**
   * Converts an excel serial date
   *
   * `ddddd.ttttt` where `ddddd` is the integer amount of days since
   * January 0, 1900 (including 29.2.1900 which does not exist) and
   * `ttttt` is the fraction of a 24-hour day.
   *
   * Thank you to stackoverflow user silkfire
   * https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript
   *
   * @param serial Excel date serial number
   */
  static excelDateToJSDate(serial: number) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  }
}
