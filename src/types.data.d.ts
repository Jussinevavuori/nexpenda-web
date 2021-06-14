// TRANSACTIONS

/**
 * Shape of a transaction's JSON data.
 */
type JsonTransaction = import("zod").TypeOf<
  typeof import("./classes/Transaction").Transaction["Schema"]
>;

/**
 * Shape of a transaction's JSON data that can be sent to the server as a
 * request to create a transaction. Does not include the ID field.
 */
type JsonTransactionInitializer = import("zod").TypeOf<
  typeof import("./classes/Transaction").Transaction["InitializerSchema"]
>;

/**
 * Shape of a transaction's JSON data that can be sent to the server as a
 * request to create a transaction. Includes the ID field.
 */
type JsonTransactionIdInitializer = import("zod").TypeOf<
  typeof import("./classes/Transaction").Transaction["IdInitializerSchema"]
>;

/**
 * Shape of a compressed transaction JSON that can be used to receive encoded
 * (size optimized) JSON data from the server. Includes both transactions and
 * categories in a single object.
 */
type CompressedTransactionsJson = import("zod").TypeOf<
  typeof import("./classes/Transaction").Transaction["CompressedJsonSchema"]
>;

/**
 * Type of a transaction object that is saved to and read from a transaction
 * spreadsheet.
 */
type JsonSpreadsheetTransaction = Pick<
  JsonTransactionInitializer,
  "category" | "comment" | "integerAmount" | "time" | "categoryIcon"
>;

// BUDGETS

/**
 * JSON shape of a budget object.
 */
type JsonBudget = import("zod").TypeOf<
  typeof import("./classes/Budget").Budget["Schema"]
>;

/**
 * JSON shape of an object that can be used to create a budget when sent to the
 * server. Does not include the ID field.
 */
type JsonBudgetInitializer = import("zod").TypeOf<
  typeof import("./classes/Budget").Budget["InitializerSchema"]
>;

/**
 * JSON shape of an object that can be used to create a budget when sent to the
 * server. Includes the ID field.
 */
type JsonBudgetIdInitializer = import("zod").TypeOf<
  typeof import("./classes/Budget").Budget["IdInitializerSchema"]
>;

// CATEGORY

/**
 * A JSON representation of a category.
 */
type JsonCategory = JsonTransaction["category"];

// APP CONFIG

/**
 * JSON representation of all app configuration values.
 */
type JsonAppConfig = import("zod").TypeOf<
  typeof import("./classes/AppConfig").AppConfig["Schema"]
>;

// AUTH

/**
 * JSON representation of an auth object representing a user.
 */
type JsonAuth = import("zod").TypeOf<
  typeof import("./classes/Auth").Auth["Schema"]
>;

/**
 * Optional subset of auth fields that can be updated via direct patch requests
 * to the server.
 */
type UpdatableJsonAuthFields = Partial<
  Pick<JsonAuth, "displayName" | "themeColor" | "themeMode">
>;
