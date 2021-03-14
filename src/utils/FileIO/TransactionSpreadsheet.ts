import { Transaction } from "../../classes/Transaction";
import { Spreadsheet } from "./Spreadsheet";

/* eslint-disable no-useless-escape */
export class TransactionSpreadsheet extends Spreadsheet<JsonSpreadsheetTransaction> {
  /**
   * The spreadsheet schema
   */
  public schema = Transaction.InitializerSchema;

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
        return Spreadsheet.excelDateToJSDate(Number(value)).getTime();
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
    categoryIcon: {
      names: ["Ikoni", "Icon", "Category icon", "Kategoria ikoni", "Kuvake"],
    },
  };

  /**
   * Spreadsheet creator
   */
  createRow(row: JsonSpreadsheetTransaction): object {
    return {
      amount: row.integerAmount / 100,
      comment: row.comment || "",
      category: row.category,
      time: new Date(row.time),
      categoryIcon: row.categoryIcon || "",
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
  sortRows(rows: JsonSpreadsheetTransaction[]): JsonSpreadsheetTransaction[] {
    return rows.sort((a, b) => a.time - b.time);
  }
}
