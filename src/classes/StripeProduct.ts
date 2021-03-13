import * as z from "zod";
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

  static Schema = z.object({
    id: z.string(),
    object: z.literal("product"),
    active: z.boolean(),
    attributes: z.array(z.any()),
    created: z.number(),
    description: z.string().nullable(),
    images: z.array(z.any()),
    livemode: z.boolean(),
    metadata: z.any(),
    name: z.string(),
    statement_descriptor: z.any(),
    type: z.string(),
    unit_label: z.string().nullable(),
    updated: z.number(),
    prices: z.array(StripePrice.Schema),
  });

  static ArraySchema = z.array(StripeProduct.Schema);

  static currencyToSymbol(currency: string) {
    switch (currency.toLowerCase()) {
      case "eur":
        return "€";
    }
    return currency.toUpperCase();
  }
}
