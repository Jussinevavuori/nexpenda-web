import { z } from "zod";
import { StripeDiscount } from "./StripeDiscount";
import { StripeSubscriptionItem } from "./StripeSubscriptionItem";

export class StripeSubscription {
  data: JsonStripeSubscription;

  constructor(json: JsonStripeSubscription) {
    this.data = json;
  }

  // ===========================================================================
  // SCHEMAS
  // ===========================================================================

  static Schema = z.object({
    id: z.string(),
    status: z.enum([
      "active",
      "canceled",
      "incomplete",
      "incomplete_expired",
      "past_due",
      "trialing",
      "unpaid",
    ]),
    object: z.literal("subscription"),
    items: z.array(StripeSubscriptionItem.Schema),
    cancel_at: z.number().nullable(),
    canceled_at: z.number().nullable(),
    cancel_at_period_end: z.boolean(),
    collection_method: z.enum(["charge_automatically", "send_invoice"]),
    created: z.number(),
    current_period_end: z.number(),
    current_period_start: z.number(),
    days_until_due: z.number().nullable(),
    discount: StripeDiscount.Schema.nullable(),
    ended_at: z.number().nullable(),
    start_date: z.number(),
    metadata: z.any(),
  });
}
