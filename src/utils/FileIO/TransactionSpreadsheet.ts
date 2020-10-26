import * as yup from "yup";
import { JsonTransaction } from "../../classes/Transaction";
import { Spreadsheet } from "./Spreadsheet";

/* eslint-disable no-useless-escape */

export type IOJsonTransaction = Pick<
  JsonTransaction,
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
        const string = String(value).replace(/[^\d\-\.]/g, "");
        const number = Number(string);
        return Math.floor(number * 100);
      },
    },
    time: {
      names: ["Aika", "Time", "Päiväys", "Päivä", "Päivämäärä", "Pvm", "Date"],
      transformBeforeValidation: (value: any) => {
        const [day, month, year] = String(value).split(".");
        const dd = day.padStart(0, "2");
        const mm = month.padStart(0, "2");
        const yyyy = year.padStart(0, "4");
        const iso = [yyyy, mm, dd].join("-");
        return new Date(iso).getTime();
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
    return `Expence | ${datestring}`;
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
