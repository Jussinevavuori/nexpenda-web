import * as z from "zod";

export class AppConfig {
  /**
   * Limit of free transactions
   */
  freeTransactionsLimit: number;

  /**
   * Limit of free budgets
   */
  freeBudgetsLimit: number;

  /**
   * Online / offline status
   */
  status: "online" | "offline";

  /**
   * Is the default app config
   */
  isDefaultAppConfig: boolean;

  constructor(args: JsonAppConfig) {
    this.status = args.status;
    this.freeTransactionsLimit = args.freeTransactionsLimit;
    this.freeBudgetsLimit = args.freeBudgetsLimit;
    this.isDefaultAppConfig = !!args.isDefaultAppConfig;
  }

  /**
   * Default configuration for when no configuration is yet fetched
   */
  static DefaultAppConfig = new AppConfig({
    freeTransactionsLimit: 1_000_000,
    freeBudgetsLimit: 1_000_000,
    status: "online",
    isDefaultAppConfig: true,
  });

  // ===========================================================================
  // SCHEMAS
  // ===========================================================================

  /**
   * Schema of budget JSON objects
   */
  static Schema = z.object({
    freeTransactionsLimit: z.number().int().positive(),
    freeBudgetsLimit: z.number().int().positive(),
    status: z.enum(["online", "offline"]),
    isDefaultAppConfig: z.boolean().optional(),
  });
}
