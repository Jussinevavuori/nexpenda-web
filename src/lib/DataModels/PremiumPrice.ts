import { z } from "zod";
import { ScheduleInterval } from "../Schedules/ScheduleInterval";

export class PremiumPrice {
  /**
   * Price's ID
   */
  id: string;
  productId: string;
  active: boolean;
  currency: string;
  nickname?: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  unitAmount?: number;
  interval?: ScheduleInterval;

  constructor(json: JsonPremiumPrice) {
    this.id = json.id;
    this.productId = json.productId;
    this.active = json.active;
    this.currency = json.currency;
    this.nickname = json.nickname;
    this.type = json.type;
    this.unitAmount = json.unitAmount;
    this.createdAt = new Date(json.createdAt);
    this.updatedAt = new Date(json.updatedAt);

    // Interval
    const type = json.recurringInterval?.toUpperCase();
    const every = json.recurringIntervalCount;
    if (
      ScheduleInterval.isValidTypeValue(type) &&
      ScheduleInterval.isValidEveryValue(every)
    ) {
      this.interval = new ScheduleInterval({ type, every });
    }
  }

  isMonthlyPrice() {
    return this.interval && this.interval.type === "MONTH";
  }

  isYearlyPrice() {
    return this.interval && this.interval.type === "YEAR";
  }

  getYearlyCost(): number {
    const amount = this.unitAmount ?? 0;

    const nOccurrencesPerYear = this.interval
      ? this.interval.getAverageOccurrencesPerYear()
      : 1;

    return nOccurrencesPerYear * amount;
  }

  getIsPercentagesCheaperThan(that: PremiumPrice) {
    const thisPrice = this.getYearlyCost();
    const thatPrice = that.getYearlyCost();
    if (thatPrice === 0) return NaN;
    return (100 * (thatPrice - thisPrice)) / thatPrice;
  }

  static createPriceComparison(order: "ASC" | "DESC" = "ASC") {
    return function (a: PremiumPrice, b: PremiumPrice) {
      const dir = order === "ASC" ? 1 : -1;
      return dir * (a.getYearlyCost() - b.getYearlyCost());
    };
  }

  static currencyToSymbol(currency: string) {
    switch (currency.toLowerCase()) {
      case "eur":
        return "€";
    }
    return currency.toUpperCase();
  }

  static Schema = z.object({
    id: z.string(),
    productId: z.string(),
    active: z.boolean(),
    currency: z.string(),
    nickname: z.string().optional(),
    type: z.string(),
    unitAmount: z.number().int().optional(),
    recurringInterval: z.string().optional(),
    recurringIntervalCount: z.number().optional(),
    createdAt: z.number().positive().int(),
    updatedAt: z.number().positive().int(),
  });

  static ArraySchema = z.array(PremiumPrice.Schema);
}
