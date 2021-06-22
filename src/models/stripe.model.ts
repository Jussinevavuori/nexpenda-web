import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy";
import { StripeProduct } from "../lib/Stripe/StripeProduct";
import { StripeService } from "../services/StripeService";
import { StoreModel } from "../store";

export interface StripeModel {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * Current products
   */
  products: StripeProduct[];

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setProductsToState: Action<StripeModel, StripeProduct[]>;

  //==============================================================//
  // THUNKS
  //==============================================================//

  /**
   * Function to start a subscribtion checkout session
   */
  getProducts: Thunk<
    StripeModel,
    void,
    any,
    StoreModel,
    ReturnType<typeof StripeService["getProducts"]>
  >;

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

  //==============================================================//
  // LISTENERS
  //==============================================================//

  /**
   * Fetch data on login
   */
  onLogin: ThunkOn<StripeModel, any, StoreModel>;
}

export const stripeModel: StripeModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//
  products: [],

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setProductsToState: action((state, payload) => {
    state.products = payload;
  }),

  //==============================================================//
  // THUNKS
  //==============================================================//

  getProducts: thunk(async (actions, payload, helpers) => {
    const result = await StripeService.getProducts();
    if (result.isSuccess()) {
      const products = result.value.map((_) => new StripeProduct(_));
      actions.setProductsToState(products);
    }
    return result;
  }),

  createCheckoutSession: thunk(async (_, payload) => {
    const result = await StripeService.createCheckoutSession(payload);
    return result;
  }),

  createBillingPortalSession: thunk(async () => {
    const result = await StripeService.createBillingPortalSession();
    return result;
  }),

  //==============================================================//
  // LISTENERS
  //==============================================================//

  onLogin: thunkOn(
    (_, storeActions) => storeActions.auth.setAuthToState,
    async (actions) => {
      actions.getProducts();
    }
  ),
};
