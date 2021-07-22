import { z } from "zod";
import { Category } from "./Category";
import { MoneyAmount } from "../Money/MoneyAmount";

export class TransactionTemplate {
  amount: MoneyAmount;
  comment?: string;
  category: Category;

  constructor(json: JsonTransactionTemplate) {
    this.amount = new MoneyAmount(json.integerAmount);
    this.category = new Category(json.category);
    this.comment = json.comment;
  }

  static Schema = z.object({
    integerAmount: z.number().int(),
    comment: z.string().optional(),
    category: z.object({
      id: z.string().nonempty(),
      value: z.string(),
      icon: z.string().optional(),
    }),
  });
}
