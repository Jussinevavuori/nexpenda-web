import {
  object,
  ObjectSchema,
  string,
  number,
  boolean,
  array,
  mixed,
} from "yup";
import { StripePrice } from "./StripePrice";
export class StripeProduct {
  data: JsonStripeProduct;

  constructor(json: JsonStripeProduct) {
    this.data = json;
  }

  get isPremiumMembership() {
    return this.data.name === "Nexpenda Premium";
  }

  get monthlyPrice() {
    return this.data.prices.find((_) => _.recurring.interval === "month");
  }

  get yearlyPrice() {
    return this.data.prices.find((_) => _.recurring.interval === "year");
  }

  static JsonSchema: ObjectSchema<JsonStripeProduct> = object({
    id: string().defined(),
    object: string<"product">().defined().equals(["product"]),
    active: boolean().defined(),
    attributes: array().defined(),
    created: number().defined(),
    description: string().defined().nullable(),
    images: array().defined(),
    livemode: boolean().defined(),
    metadata: mixed(),
    name: string().defined(),
    statement_descriptor: mixed(),
    type: string().defined(),
    unit_label: string().defined().nullable(),
    updated: number().defined(),
    prices: array().of(StripePrice.JsonSchema).defined(),
  }).defined();

  static isJson(arg: any): arg is JsonStripeProduct {
    try {
      StripeProduct.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  static isJsonArray(arg: any): arg is JsonStripeProduct[] {
    return Array.isArray(arg) && arg.every(StripeProduct.isJson);
  }

  static currencyToSymbol(currency: string) {
    switch (currency.toLowerCase()) {
      case "eur":
        return "€";
    }
    return currency.toUpperCase();
  }
}
