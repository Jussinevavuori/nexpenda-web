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
import { StripeProduct } from "../lib/Stripe/StripeProduct";

export class StripeService extends Service {
  static getStripe() {
    return loadStripe(Config.STRIPE_PUBLISHABLE_KEY);
  }

  static async getProducts() {
    const result = await this.get("/stripe/products", {});

    if (result.isFailure()) {
      return result;
    } else if (StripeProduct.ArraySchema.check(result.value.data)) {
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

  /**
   * Start subscription by creating a checkout session
   */
  static async createBillingPortalSession() {
    const result = await Service.post("/stripe/create-billing-portal-session");

    try {
      const stripe = await this.getStripe();

      if (result.isFailure()) {
        return result;
      } else if (!stripe) {
        return new StripeInitializationFailure<StripeSessionUrlResponse>();
      } else if (StripeUtils.isStripeSessionUrlResponse(result.value.data)) {
        window.location.href = result.value.data.url;
        return new Success(result.value.data);
      } else {
        return new InvalidServerResponseFailure<StripeSessionUrlResponse>(
          result.value,
          "/stripe/create-billing-portal-session"
        );
      }
    } catch (e) {
      return new ErrorFailure<StripeSessionUrlResponse>(e);
    }
  }
}
