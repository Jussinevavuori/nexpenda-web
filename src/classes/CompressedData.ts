import { DataUtils } from "../utils/DataUtils/DataUtils";
import { Category, CompressedJsonCategory } from "./Category";
import { Transaction, CompressedJsonTransaction } from "./Transaction";
import { object, ObjectSchema, array } from "yup";

export type CompressedDataJson = {
  t: CompressedJsonTransaction[];
  c: CompressedJsonCategory[];
};

/**
 * Compressed data is used to compress and parse compressed transaction data.
 */
export class CompressedData {
  static compress(transactions: Transaction[]): CompressedDataJson {
    const categories = DataUtils.unique(
      transactions.map((t) => t.category),
      (a, b) => a.id === b.id
    );

    const CompressedCategories = categories.map((_) => _.toCompressedJson());

    const CompressedTransactions = transactions.map((_) =>
      _.toCompressedJson()
    );

    return {
      t: CompressedTransactions,
      c: CompressedCategories,
    };
  }

  static parse(data: CompressedDataJson): Transaction[] {
    let transactions = [] as Transaction[];

    const categories = data.c.map((CompressedCategory) => {
      return Category.fromCompressed(CompressedCategory);
    });

    data.t.forEach((compressedTransaction) => {
      const category = categories.find(
        (c) => c.id === compressedTransaction.cid
      );
      if (!category) return;
      const transaction = Transaction.fromCompressed(
        compressedTransaction,
        category
      );
      transactions.push(transaction);
    });

    return transactions;
  }

  static CompressedDataJsonSchema: ObjectSchema<CompressedDataJson> = object({
    t: array().of(Transaction.CompressedJsonSchema).required(),
    c: array().of(Category.CompressedJsonSchema).required(),
  }).required();

  static isCompressedDataJson(arg: any): arg is CompressedDataJson {
    try {
      CompressedData.CompressedDataJsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }
}
