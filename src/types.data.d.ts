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

type JsonBudget = import("zod").TypeOf<
  typeof import("./classes/Budget").Budget["Schema"]
>;
type JsonBudgetInitializer = import("zod").TypeOf<
  typeof import("./classes/Budget").Budget["InitializerSchema"]
>;
type JsonBudgetIdInitializer = import("zod").TypeOf<
  typeof import("./classes/Budget").Budget["IdInitializerSchema"]
>;
type BudgetType = import("zod").TypeOf<
  typeof import("./classes/Budget").Budget["Schema"]["shape"]["type"]
>;

type JsonCategory = JsonTransaction["category"];
type JsonAppConfig = import("zod").TypeOf<
  typeof import("./classes/AppConfig").AppConfig["Schema"]
>;

type JsonSpreadsheetTransaction = Pick<
  JsonTransactionInitializer,
  "category" | "comment" | "integerAmount" | "time" | "categoryIcon"
>;
