import { Transaction } from "../DataModels/Transaction";
import { Spreadsheet } from "./Spreadsheet";

/* eslint-disable no-useless-escape */
export class TransactionSpreadsheet extends Spreadsheet<JsonSpreadsheetTransaction> {
  public options = TransactionSpreadsheet.options;
  public schema = TransactionSpreadsheet.schema;

  /**
   * The constructor can be provided with a list of transactions
   * as a shorthand for `loadTransactions`:
   *
   * @example
   * ```
   * // These are equal
   * const spreadsheet = new TransactionSpreadsheet()
   * spreadsheet.loadTransactions(transactions)
   *
   * const spreadsheet = new TransactionSpreadsheet(transactions)
   * ```
   *
   * @param transactions List of transactions to load into spreadsheet.
   */
  constructor(transactions?: Transaction[]) {
    super();
    if (transactions) {
      this.loadTransactions(transactions);
    }
  }

  /**
   * The spreadsheet schema
   */
  public static schema = Transaction.InitializerSchema;

  /**
   * The spreadsheet options
   */
  public static options = {
    category: {
      names: ["Kategoria", "Category", "Class", "Luokka"],
    },
    integerAmount: {
      names: ["Summa", "Sum", "Määrä", "Amount", "integerAmount"],
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
      names: [
        "Ikoni",
        "Icon",
        "Category icon",
        "categoryIcon",
        "Kategoria ikoni",
        "Kuvake",
      ],
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

  /**
   * Wrapper for the `loadRows` function to enable directly loading
   * transaction objects.
   */
  loadTransactions(transactions: Transaction[]) {
    return this.loadRows(
      transactions.map((t) => ({
        category: t.category.value,
        integerAmount: t.amount.value,
        time: t.date.getTime(),
        comment: t.comment,
        categoryIcon: t.category.icon ?? "",
      }))
    );
  }
}
