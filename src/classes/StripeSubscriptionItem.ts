import { object, ObjectSchema, string, number, mixed, array } from "yup";
import { StripePrice } from "./StripePrice";

export class StripeSubscriptionItem {
  data: JsonStripeSubscriptionItem;

  constructor(json: JsonStripeSubscriptionItem) {
    this.data = json;
  }

  static JsonSchema: ObjectSchema<JsonStripeSubscriptionItem> = object({
    id: string().defined(),
    metadata: mixed(),
    price: StripePrice.JsonSchema,
    quantity: number().defined(),
    subscription: string().defined(),
    object: string<"subscription_item">().equals(["subscription_item"]),
    billing_thresholds: mixed(),
    created: number().defined(),
    tax_rates: array().of(mixed()).defined(),
  }).defined();

  static isJson(arg: any): arg is JsonStripeSubscriptionItem {
    try {
      StripeSubscriptionItem.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  static isJsonArray(arg: any): arg is JsonStripeSubscriptionItem[] {
    return Array.isArray(arg) && arg.every(StripeSubscriptionItem.isJson);
  }
}
