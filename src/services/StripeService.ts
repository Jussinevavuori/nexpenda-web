import { Service } from "./Service";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";
import { Success } from "../result/Success";
import {
  StripeSessionIdResponse,
  StripeUtils,
} from "../utils/StripeUtils/StripeUtils";
import { Config } from "../config";
import { loadStripe } from "@stripe/stripe-js";
import { StripeInitializationFailure } from "../result/StripeFailure";
import { ErrorFailure } from "../result/GenericFailures";
import { StripeProduct } from "../classes/StripeProduct";

export class StripeService extends Service {
  static getStripe() {
    return loadStripe(Config.STRIPE_PUBLISHABLE_KEY);
  }

  static async getProducts() {
    const result = await this.get("/stripe/products");

    if (result.isFailure()) {
      return result;
    } else if (StripeProduct.isJsonArray(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<StripeProduct[]>(
        result.value,
        "/stripe/products"
      );
    }
  }

  /**
   * Start subscription by creating a checkout session
   */
  static async createCheckoutSession(priceId: string) {
    const result = await Service.post<
      { priceId: string },
      StripeSessionIdResponse
    >("/stripe/create-checkout-session", {
      priceId,
    });

    try {
      const stripe = await this.getStripe();

      if (result.isFailure()) {
        return result;
      } else if (!stripe) {
        return new StripeInitializationFailure<StripeSessionIdResponse>();
      } else if (StripeUtils.isStripeSessionIdResponse(result.value.data)) {
        await stripe.redirectToCheckout({
          sessionId: result.value.data.sessionId,
        });
        return new Success(result.value.data);
      } else {
        return new InvalidServerResponseFailure<StripeSessionIdResponse>(
          result.value,
          "/stripe/create-checkout-session"
        );
      }
    } catch (e) {
      return new ErrorFailure<StripeSessionIdResponse>(e);
    }
  }
}
