import { PremiumPrice } from "../lib/DataModels/PremiumPrice";
import { InvalidServerResponseFailure } from "../lib/Result/Failures";
import { Success } from "../lib/Result/Success";
import { Service } from "./Service";

export class PremiumPriceService extends Service {
  static async getPremiumPrices() {
    const result = await this.get("/stripe/premium_prices", {});

    if (result.isFailure()) {
      return result;
    } else if (PremiumPrice.ArraySchema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<PremiumPrice[]>(
        result.value,
        "/premium_prices"
      );
    }
  }
}
