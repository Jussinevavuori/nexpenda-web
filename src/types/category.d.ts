/**
 * JSON category schema type
 */
type JsonCategory = import("zod").TypeOf<
  typeof import("../lib/DataModels/Category").Budget["Schema"]
>;
