import * as yup from "yup";
import { JsonTransaction } from "../../classes/Transaction";
import { Spreadsheet } from "./Spreadsheet";

/* eslint-disable no-useless-escape */

export type IOJsonTransaction = Pick<
  JsonTransaction,
  "category" | "comment" | "integerAmount" | "time"
>;

export class TransactionSpreadsheet extends Spreadsheet<IOJsonTransaction> {
  public schema = yup
    .object<IOJsonTransaction>({
      comment: yup.string(),
      category: yup.string().defined().min(1),
      integerAmount: yup.number().defined().integer(),
      time: yup.number().defined().positive().integer(),
    })
    .defined();

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
}
