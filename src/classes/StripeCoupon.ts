import { object, ObjectSchema, string, number, boolean, mixed } from "yup";

export class StripeCoupon {
  data: JsonStripeCoupon;

  constructor(json: JsonStripeCoupon) {
    this.data = json;
  }

  static JsonSchema: ObjectSchema<JsonStripeCoupon> = object({
    id: string().defined(),
    object: string<"coupon">().defined().equals(["coupon"]),
    amount_off: number().defined().nullable(),
    created: number().defined(),
    currency: string().defined().nullable(),
    duration: string<"once" | "repeating" | "forever">()
      .defined()
      .equals(["forever", "once", "repeating"]),
    duration_in_months: number().defined().nullable(),
    metadata: mixed(),
    name: string().defined(),
    percent_off: number().defined().nullable(),
    applies_to: mixed(),
    livemode: boolean().defined(),
    max_redemptions: number().defined().nullable(),
    redeem_by: number().defined().nullable(),
    times_redeemed: number().defined().nullable(),
    valid: boolean().defined(),
  }).defined();

  static isJson(arg: any): arg is JsonStripeCoupon {
    try {
      StripeCoupon.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  static isJsonArray(arg: any): arg is JsonStripeCoupon[] {
    return Array.isArray(arg) && arg.every(StripeCoupon.isJson);
  }
}
