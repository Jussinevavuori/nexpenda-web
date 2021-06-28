import { Thunk, thunk } from "easy-peasy";
import { StripeService } from "../services/StripeService";
import { StoreModel } from "../store";

export interface StripeModel {
  //==============================================================//
  // THUNKS
  //==============================================================//

  /**
   * Function to start a subscribtion checkout session
   */
  createCheckoutSession: Thunk<
    StripeModel,
    Parameters<typeof StripeService["createCheckoutSession"]>[0],
    any,
    StoreModel,
    ReturnType<typeof StripeService["createCheckoutSession"]>
  >;

  /**
   * Function to start a subscribtion checkout session
   */
  createBillingPortalSession: Thunk<
    StripeModel,
    void,
    any,
    StoreModel,
    ReturnType<typeof StripeService["createBillingPortalSession"]>
  >;
}

export const stripeModel: StripeModel = {
  //==============================================================//
  // THUNKS
  //==============================================================//

  createCheckoutSession: thunk(async (_, payload) => {
    const result = await StripeService.createCheckoutSession(payload);
    return result;
  }),

  createBillingPortalSession: thunk(async () => {
    const result = await StripeService.createBillingPortalSession();
    return result;
  }),
};
