import XLSX from "xlsx";
import * as yup from "yup";
import { Failure, Result, Success } from "../Result/Result";
import { Try } from "../Result/Try";
import { FileIO } from "./FileIO";

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
    return Try(async () => {
      if (typeof row !== "object" || !row) {
        return new Failure(null, {
          status: 10,
          code: "spreadsheet/invalid-row",
          message: "Invalid row",
        });
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
        return Success.From(validation);
      } catch (e) {
        return new Failure(null, {
          status: 10,
          code: "spreadsheet/error-parsing-row",
          message: "Error parsing row",
        });
      }
    });
  }

  /**
   * Takes a HTML input (input) and reads a file from it. On file upload,
   * parses the file to an arraybuffer, then an XLSX workbook, from which
   * it parses all the rows to objects and returns all the succesfully
   * parsed rows.
   *
   * @param input HTMLInputElement (with type of file)
   */
  readFile(
    input: HTMLInputElement
  ): Promise<Result<{ success: T[]; failed: number }, any>> {
    return Try(async () => {
      try {
        /**
         * Parse to array buffer
         */
        const arrayBuffer = await FileIO.readFileAsArrayBuffer(input);
        if (arrayBuffer.isFailure()) {
          return new Failure<{ success: T[]; failed: number }, any>(
            arrayBuffer.value,
            arrayBuffer.details
          );
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
        return Success.From({
          success: succeededRows.map((_) => _.value),
          failed: failedRows.length,
        });

        /**
         * Catch errors and return errors as failures
         */
      } catch (error) {
        console.error(error);
        return new Failure<{ success: T[]; failed: number }, any>(error, {
          code: "transaction-io/error",
          status: 10,
          message: `An error occured while reading JSON transactions from file (${
            error?.message ?? ""
          })`,
        });
      }
    });
  }
}
