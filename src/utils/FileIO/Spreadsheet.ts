import XLSX from "xlsx";
import * as yup from "yup";
import { ErrorFailure } from "../Failures/GenericFailures";
import {
  SpreadsheetReadFileFailure,
  SpreadsheetReadRowFailure,
} from "../Failures/SpreadsheetFailures";
import { Failure, Success } from "../Result/Result";
import { FileIO } from "./FileIO";

export type SpreadsheetReadFileResult<T> = {
  rows: T[];
  succeeded: number;
  failed: number;
  total: number;
};

export abstract class Spreadsheet<T extends object> {
  public abstract schema: yup.ObjectSchema<T>;
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
      return new ErrorFailure<T>(e);
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
      /**
       * Parse to array buffer
       */
      const arrayBuffer = await FileIO.readFileAsArrayBuffer(input);
      if (arrayBuffer.isFailure()) {
        return new SpreadsheetReadFileFailure<SpreadsheetReadFileResult<T>>();
      }

      /**
       * Read to JSON
       */
      const workbook = XLSX.read(arrayBuffer.value, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { raw: false });

      /**
       * Parse rows
       */
      const rowParsers = json.map((row) => this.parseRow(row));
      const parsedRows = await Promise.all(rowParsers);
      const succeededRows = Success.All(parsedRows);
      const failedRows = Failure.All(parsedRows);

      /**
       * Warn on failed rows
       */
      if (failedRows.length > 0) {
        console.warn(`Failed parsing ${failedRows.length} rows`);
      }

      /**
       * Return succeeded rows and count of failed rows
       */
      return new Success<SpreadsheetReadFileResult<T>>({
        rows: succeededRows.map((_) => _.value),
        succeeded: succeededRows.length,
        failed: failedRows.length,
        total: succeededRows.length + failedRows.length,
      });

      /**
       * Catch errors and return errors as failures
       */
    } catch (error) {
      return new ErrorFailure<SpreadsheetReadFileResult<T>>(error);
    }
  }
}
