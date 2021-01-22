import * as yup from "yup";
import { JsonTransactionInitializer } from "../../classes/Transaction";
import { Spreadsheet } from "./Spreadsheet";

/* eslint-disable no-useless-escape */

export type IOJsonTransaction = Pick<
  JsonTransactionInitializer,
  "category" | "comment" | "integerAmount" | "time"
>;

export class TransactionSpreadsheet extends Spreadsheet<IOJsonTransaction> {
  /**
   * The spreadsheet schema
   */
  public schema = yup
    .object<IOJsonTransaction>({
      comment: yup.string(),
      category: yup.string().defined().min(1),
      integerAmount: yup.number().defined().integer(),
      time: yup.number().defined().positive().integer(),
    })
    .defined();

  /**
   * The spreadsheet options
   */
  public options = {
    category: {
      names: ["Kategoria", "Category", "Class", "Luokka"],
    },
    integerAmount: {
      names: ["Summa", "Sum", "Määrä", "Amount"],
      transformBeforeValidation: (value: any) => {
        const string = String(value)
          .replace(/,/g, ".")
          .replace(/[^\d\-\.]/g, "");
        const number = Number(string);
        return Math.round(number * 100);
      },
    },
    time: {
      names: ["Aika", "Time", "Päiväys", "Päivä", "Päivämäärä", "Pvm", "Date"],
      transformBeforeValidation: (value: any) => {
        return excelDateToJSDate(Number(value)).getTime();
      },
    },
    comment: {
      names: [
        "Kommentti",
        "Selite",
        "Seloste",
        "Lisätieto",
        "Details",
        "Comment",
        "Explanation",
        "Description",
      ],
    },
  };

  /**
   * Spreadsheet creator
   */
  createRow(row: IOJsonTransaction): object {
    return {
      amount: row.integerAmount / 100,
      comment: row.comment || "",
      category: row.category,
      time: new Date(row.time),
    };
  }

  /**
   * Spreadsheet file name
   */
  getFileName() {
    const datestring = new Date().toLocaleDateString();
    return `Nexpenda - ${datestring}`;
  }

  /**
   * Spreadsheet sheet name
   */
  getFileSheetName() {
    return `Transactions`;
  }

  /**
   * Spreadsheet row order
   */
  sortRows(rows: IOJsonTransaction[]): IOJsonTransaction[] {
    return rows.sort((a, b) => {
      return a.time - b.time;
    });
  }
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
function excelDateToJSDate(serial: number) {
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
