import { PremiumPrice } from "../lib/DataModels/PremiumPrice";
import { Service } from "./Service";

export class PremiumPriceService extends Service {
  /**
   * Get all premium prices
   */
  static async getPremiumPrices() {
    const result = await this.get("/stripe/premium_prices", {});
    return Service.validateResult(result, PremiumPrice.ArraySchema);
  }
}
