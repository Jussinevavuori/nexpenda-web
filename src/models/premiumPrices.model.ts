import { Action, action, Thunk, thunk } from "easy-peasy";
import { PremiumPrice } from "../lib/DataModels/PremiumPrice";
import { PremiumPriceService } from "../services/PremiumPriceService";
import { StoreModel } from "../store";

export interface PremiumPricesModel {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * Current products
   */
  items: PremiumPrice[];

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setState: Action<PremiumPricesModel, PremiumPrice[]>;

  //==============================================================//
  // THUNKS
  //==============================================================//

  getPremiumPrices: Thunk<
    PremiumPricesModel,
    void,
    any,
    StoreModel,
    ReturnType<typeof PremiumPriceService["getPremiumPrices"]>
  >;
}

export const premiumPricesModel: PremiumPricesModel = {
  items: [],
  setState: action((state, payload) => {
    state.items = payload;
  }),
  getPremiumPrices: thunk(async (actions, payload, helpers) => {
    const result = await PremiumPriceService.getPremiumPrices();
    if (result.isSuccess()) {
      const items = result.value.map((_) => new PremiumPrice(_));
      actions.setState(items);
    }
    return result;
  }),
};
