/**
 * JSON transaction schedule schema type
 */
type JsonTransactionSchedule = import("zod").TypeOf<
  typeof import("../lib/DataModels/TransactionSchedule").TransactionSchedule["Schema"]
>;

/**
 * Transaction schedule initializer type for initializing a schedule
 */
type TransactionScheduleInitializer = {
  schedule: {
    firstOccurrence: number;
    occurrences?: number;
    interval: {
      type: "DAY" | "WEEK" | "MONTH" | "YEAR";
      every: number;
    };
  };
  transactionTemplate: {
    integerAmount: number;
    category: string;
    comment?: string;
    categoryIcon?: string;
  };
  assignTransactions?: string[];
};

/**
 * Transaction schedule updater type for updating a schedule
 */
type TransactionScheduleUpdater = Partial<{
  schedule?: Partial<{
    firstOccurrence: number;
    occurrences: number | null;
    interval: {
      type: "DAY" | "WEEK" | "MONTH" | "YEAR";
      every: number;
    };
  }>;
  transactionTemplate?: Partial<{
    integerAmount: number;
    category: string;
    comment?: string | null;
    categoryIcon?: string;
  }>;
  assignTransactions?: string[];
  updateAllTransactions?: boolean;
}>;

/**
 * Postable transaction schedule
 */
type PostableTransactionSchedule =
  PostableObject<TransactionScheduleInitializer>;

/**
 * Puttable transaction schedule
 */
type PuttableTransactionSchedule =
  PuttableObject<TransactionScheduleInitializer>;

/**
 * Patchable transaction schedule
 */
type PatchableTransactionSchedule = PatchableObject<TransactionScheduleUpdater>;
