import * as z from "zod";

export class StripeCoupon {
  data: JsonStripeCoupon;

  constructor(json: JsonStripeCoupon) {
    this.data = json;
  }

  // ===========================================================================
  // SCHEMAS
  // ===========================================================================

  static Schema = z.object({
    id: z.string(),
    object: z.literal("coupon"),
    amount_off: z.number().nullable(),
    created: z.number(),
    currency: z.string().nullable(),
    duration: z.enum(["forever", "once", "repeating"]),
    duration_in_months: z.number().nullable(),
    metadata: z.any(),
    name: z.string(),
    percent_off: z.number().nullable(),
    applies_to: z.any(),
    livemode: z.boolean(),
    max_redemptions: z.number().nullable(),
    redeem_by: z.number().nullable(),
    times_redeemed: z.number().nullable(),
    valid: z.boolean(),
  });
}
