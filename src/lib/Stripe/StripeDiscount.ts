import { StripeCoupon } from "./StripeCoupon";
import { z } from "zod";
export class StripeDiscount {
  data: JsonStripeDiscount;

  constructor(json: JsonStripeDiscount) {
    this.data = json;
  }

  // ===========================================================================
  // SCHEMAS
  // ===========================================================================

  static Schema = z.object({
    id: z.string(),
    object: z.literal("discount"),
    checkout_session: z.string().nullable(),
    coupon: StripeCoupon.Schema,
    customer: z.string(),
    end: z.number().nullable(),
    start: z.number().nullable(),
    invoice: z.string().nullable(),
    invoice_item: z.string().nullable(),
    promotion_code: z.string().nullable(),
  });
}
