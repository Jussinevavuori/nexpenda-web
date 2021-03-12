import {
  object,
  ObjectSchema,
  string,
  array,
  number,
  boolean,
  mixed,
} from "yup";
import { StripeDiscount } from "./StripeDiscount";
import { StripeSubscriptionItem } from "./StripeSubscriptionItem";

export class StripeSubscription {
  data: JsonStripeSubscription;

  constructor(json: JsonStripeSubscription) {
    this.data = json;
  }

  static JsonSchema: ObjectSchema<JsonStripeSubscription> = object({
    id: string().defined(),
    status: string<JsonStripeSubscriptionStatus>()
      .defined()
      .equals([
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "trialing",
        "unpaid",
      ]),
    object: string<"subscription">().defined().equals(["subscription"]),
    items: array().of(StripeSubscriptionItem.JsonSchema).defined(),

    cancel_at: number().defined().nullable(),
    canceled_at: number().defined().nullable(),
    cancel_at_period_end: boolean().defined(),
    collection_method: string<"charge_automatically" | "send_invoice">()
      .defined()
      .equals(["charge_automatically", "send_invoice"]),
    created: number().defined(),
    current_period_end: number().defined(),
    current_period_start: number().defined(),
    days_until_due: number().defined().nullable(),
    discount: StripeDiscount.JsonSchema.nullable(),
    ended_at: number().defined().nullable(),
    start_date: number().defined(),
    metadata: mixed(),
  }).defined();

  static isJson(arg: any): arg is JsonStripeSubscription {
    try {
      StripeSubscription.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  static isJsonArray(arg: any): arg is JsonStripeSubscription[] {
    return Array.isArray(arg) && arg.every(StripeSubscription.isJson);
  }
}
