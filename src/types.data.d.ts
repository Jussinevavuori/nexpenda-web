type JsonTransaction = import("zod").TypeOf<
  typeof import("./classes/Transaction").Transaction["Schema"]
>;
type JsonTransactionInitializer = import("zod").TypeOf<
  typeof import("./classes/Transaction").Transaction["InitializerSchema"]
>;
type JsonTransactionIdInitializer = import("zod").TypeOf<
  typeof import("./classes/Transaction").Transaction["IdInitializerSchema"]
>;
type CompressedTransactionsJson = import("zod").TypeOf<
  typeof import("./classes/Transaction").Transaction["CompressedJsonSchema"]
>;

type JsonCategory = JsonTransaction["category"];

type JsonSpreadsheetTransaction = Pick<
  JsonTransactionInitializer,
  "category" | "comment" | "integerAmount" | "time" | "categoryIcon"
>;
