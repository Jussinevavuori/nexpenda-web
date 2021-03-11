import {
  object,
  ObjectSchema,
  string,
  number,
  boolean,
  array,
  mixed,
} from "yup";

export type JsonStripePrice = {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  livemode: boolean;
  lookup_key: any;
  metadata: any;
  nickname: string | null;
  product: string;
  tiers_mode: any;
  transform_quantity: number | null;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
  recurring: {
    aggretage_usage: any;
    interval: string;
    trial_period_days: number | null;
    usage_type: string;
    interval_count: number;
  };
};

export type JsonStripeProduct = {
  id: string;
  object: string;
  active: boolean;
  attributes: any[];
  created: number;
  description: string | null;
  images: any[];
  livemode: boolean;
  metadata: any;
  name: string;
  statement_descriptor: any;
  type: string;
  unit_label: string | null;
  updated: number;
  prices: JsonStripePrice[];
};

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

  static JsonPriceSchema: ObjectSchema<JsonStripePrice> = object({
    id: string().defined(),
    object: string().defined(),
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

  static JsonSchema: ObjectSchema<JsonStripeProduct> = object({
    id: string().defined(),
    object: string().defined(),
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
    prices: array().of(StripeProduct.JsonPriceSchema).defined(),
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
