/**
 * JSON transaction schema type
 */
type JsonTransaction = import("zod").TypeOf<
  typeof import("../lib/DataModels/Transaction").Transaction["Schema"]
>;

/**
 * Transaction initializer for communicating with the server
 */
type TransactionInitializer = Omit<
  ObjectInitializer<JsonTransaction>,
  "category"
> & { category: string };

/**
 * Postable transaction
 */
type PostableTransaction = PostableObject<TransactionInitializer>;

/**
 * Puttable transaction
 */
type PuttableTransaction = PuttableObject<TransactionInitializer>;

/**
 * Patchable transaction
 */
type PatchableTransaction = PatchableObject<TransactionInitializer>;

/**
 * Compressed transaction schema type containing category information
 */
type CompressedTransactions = import("zod").TypeOf<
  typeof import("../lib/DataModels/Transaction").Transaction["CompressedSchema"]
>;

/**
 * Spreadsheet transaction for interacting with transaction spreadsheets
 */
type SpreadsheetTransaction = Pick<
  TransactionInitializer,
  "comment" | "integerAmount" | "time" | "category"
> &
  Partial<Pick<TransactionInitializer, "categoryIcon">>;
