import { Service } from "./Service";
import { InvalidServerResponseFailure } from "../lib/Result/Failures";
import { Success } from "../lib/Result/Success";
import {
  StripeSessionIdResponse,
  StripeSessionUrlResponse,
  StripeUtils,
} from "../lib/Stripe/StripeUtils";
import { Config } from "../config";
import { loadStripe } from "@stripe/stripe-js";
import { StripeInitializationFailure } from "../lib/Result/Failures";
import { ErrorFailure } from "../lib/Result/Failures";

export class StripeService extends Service {
  static getStripe() {
    return loadStripe(Config.STRIPE_PUBLISHABLE_KEY);
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
      }

      if (!stripe) {
        return new StripeInitializationFailure<StripeSessionIdResponse>();
      }

      if (StripeUtils.isStripeSessionIdResponse(result.value.data)) {
        await stripe.redirectToCheckout({
          sessionId: result.value.data.sessionId,
        });
        return new Success(result.value.data);
      }

      return new InvalidServerResponseFailure<StripeSessionIdResponse>(
        result.value
      );
    } catch (e) {
      return new ErrorFailure<StripeSessionIdResponse>(e);
    }
  }

  /**
   * Start subscription by creating a checkout session
   */
  static async createBillingPortalSession() {
    const result = await Service.post("/stripe/create-billing-portal-session");

    try {
      const stripe = await this.getStripe();

      if (result.isFailure()) {
        return result;
      }

      if (!stripe) {
        return new StripeInitializationFailure<StripeSessionUrlResponse>();
      }

      if (StripeUtils.isStripeSessionUrlResponse(result.value.data)) {
        window.location.href = result.value.data.url;
        return new Success(result.value.data);
      }

      return new InvalidServerResponseFailure<StripeSessionUrlResponse>(
        result.value
      );
    } catch (e) {
      return new ErrorFailure<StripeSessionUrlResponse>(e);
    }
  }
}
