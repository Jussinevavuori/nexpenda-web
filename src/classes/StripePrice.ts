import { object, ObjectSchema, string, number, boolean, mixed } from "yup";

export class StripePrice {
  data: JsonStripePrice;

  constructor(json: JsonStripePrice) {
    this.data = json;
  }

  static JsonSchema: ObjectSchema<JsonStripePrice> = object({
    id: string().defined(),
    object: string<"price">().defined().equals(["price"]),
    active: boolean().defined(),
    billing_scheme: string().defined(),
    created: number().defined(),
    currency: string().defined(),
    livemode: boolean().defined(),
    lookup_key: mixed(),
    metadata: mixed(),
    nickname: string().defined().nullable(),
    product: string().defined(),
    tiers_mode: mixed(),
    transform_quantity: number().defined().nullable(),
    type: string().defined(),
    unit_amount: number().defined(),
    unit_amount_decimal: string().defined(),
    recurring: object({
      aggretage_usage: mixed<any>(),
      interval: string().defined(),
      trial_period_days: number().defined().nullable(),
      usage_type: string().defined(),
      interval_count: number().defined(),
    }).defined(),
  }).defined();

  static isJson(arg: any): arg is JsonStripePrice {
    try {
      StripePrice.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  static isJsonArray(arg: any): arg is JsonStripePrice[] {
    return Array.isArray(arg) && arg.every(StripePrice.isJson);
  }
}
