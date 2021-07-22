/**
 * JSON transaction template schema type
 */
type JsonTransactionTemplate = import("zod").TypeOf<
  typeof import("../lib/DataModels/TransactionTemplate").TransactionTemplate["Schema"]
>;
