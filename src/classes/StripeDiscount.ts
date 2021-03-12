import { object, ObjectSchema, string, number } from "yup";
import { StripeCoupon } from "./StripeCoupon";

export class StripeDiscount {
  data: JsonStripeDiscount;

  constructor(json: JsonStripeDiscount) {
    this.data = json;
  }

  static JsonSchema: ObjectSchema<JsonStripeDiscount> = object({
    id: string().defined(),
    object: string<"discount">().defined().equals(["discount"]),
    checkout_session: string().defined().nullable(),
    coupon: StripeCoupon.JsonSchema,
    customer: string().defined(),
    end: number().defined().nullable(),
    start: number().defined().nullable(),
    invoice: string().defined().nullable(),
    invoice_item: string().defined().nullable(),
    promotion_code: string().defined().nullable(),
  }).defined();

  static isJson(arg: any): arg is JsonStripeDiscount {
    try {
      StripeDiscount.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  static isJsonArray(arg: any): arg is JsonStripeDiscount[] {
    return Array.isArray(arg) && arg.every(StripeDiscount.isJson);
  }
}
