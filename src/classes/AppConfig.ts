import * as z from "zod";

export class AppConfig {
  /**
   * Limit of free transactions
   */
  freeTransactionsLimit: number;

  /**
   * Online / offline status
   */
  status: "online" | "offline";

  constructor(args: {
    status: AppConfig["status"];
    freeTransactionsLimit: AppConfig["freeTransactionsLimit"];
  }) {
    this.status = args.status;
    this.freeTransactionsLimit = args.freeTransactionsLimit;
  }

  /**
   * Schema of budget JSON objects
   */
  static Schema = z.object({
    freeTransactionsLimit: z.number().int().positive(),
    status: z.enum(["online", "offline"]),
  });

  /**
   * Default configuration for when no configuration is yet fetched
   */
  static DefaultAppConfig = new AppConfig({
    freeTransactionsLimit: 1_000_000,
    status: "online",
  });
}
