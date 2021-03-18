import * as z from "zod";
export class StripeCustomer {
  data: JsonStripeCustomer;

  constructor(json: JsonStripeCustomer) {
    this.data = json;
  }

  static Schema = z.object({
    id: z.string(),
    object: z.literal("customer"),
  });
}