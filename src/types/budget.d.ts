/**
 * JSON budget schema type
 */
type JsonBudget = import("zod").TypeOf<
  typeof import("../lib/DataModels/Budget").Budget["Schema"]
>;

/**
 * Budget initializer for sending to the server
 */
type BudgetInitializer = ObjectInitializer<JsonBudget>;

/**
 * Postable budget
 */
type PostableBudget = PostableObject<BudgetInitializer>;

/**
 * Puttable budget
 */
type PuttableBudget = PuttableObject<BudgetInitializer>;

/**
 * Patchable budget
 */
type PatchableBudget = PatchableObject<BudgetInitializer>;
