import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy";
import { StripeProduct } from "../classes/StripeProduct";
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

  createCheckoutSession: thunk(async (actions, payload, helpers) => {
    const result = await StripeService.createCheckoutSession(payload);
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
