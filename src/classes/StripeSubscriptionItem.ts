import * as z from "zod";
import { StripePrice } from "./StripePrice";

export class StripeSubscriptionItem {
  data: JsonStripeSubscriptionItem;

  constructor(json: JsonStripeSubscriptionItem) {
    this.data = json;
  }

  static Schema = z.object({
    id: z.string(),
    metadata: z.any(),
    price: StripePrice.Schema,
    quantity: z.number(),
    subscription: z.string(),
    object: z.literal("subscription_item"),
    billing_thresholds: z.any(),
    created: z.number(),
    tax_rates: z.array(z.any()),
  });
}
