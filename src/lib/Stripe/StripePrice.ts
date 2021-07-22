import { z } from "zod";
export class StripePrice {
  data: JsonStripePrice;

  constructor(json: JsonStripePrice) {
    this.data = json;
  }

  // ===========================================================================
  // SCHEMAS
  // ===========================================================================

  static Schema = z.object({
    id: z.string(),
    object: z.literal("price"),
    active: z.boolean(),
    billing_scheme: z.string(),
    created: z.number(),
    currency: z.string(),
    livemode: z.boolean(),
    lookup_key: z.any(),
    metadata: z.any(),
    nickname: z.string().nullable(),
    product: z.string(),
    tiers_mode: z.any(),
    transform_quantity: z.number().nullable(),
    type: z.string(),
    unit_amount: z.number(),
    unit_amount_decimal: z.string(),
    recurring: z.object({
      aggregate_usage: z.any(),
      interval: z.string(),
      trial_period_days: z.number().nullable(),
      usage_type: z.string(),
      interval_count: z.number(),
    }),
  });
}
