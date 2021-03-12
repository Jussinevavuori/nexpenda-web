import { object, ObjectSchema, string } from "yup";

export class StripeCustomer {
  data: JsonStripeCustomer;

  constructor(json: JsonStripeCustomer) {
    this.data = json;
  }

  static JsonSchema: ObjectSchema<JsonStripeCustomer> = object({
    id: string().defined(),
    object: string<"customer">().defined().equals(["customer"]),
  }).defined();

  static isJson(arg: any): arg is JsonStripeCustomer {
    try {
      StripeCustomer.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  static isJsonArray(arg: any): arg is JsonStripeCustomer[] {
    return Array.isArray(arg) && arg.every(StripeCustomer.isJson);
  }
}
