import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy";
import { BudgetService } from "../services/BudgetService";
import { StoreModel } from "../store";
import { Budget } from "../lib/DataModels/Budget";
import { DeleteBudgetEvent } from "../history/DeleteBudgetEvent";

export interface BudgetsModel {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * All user's current budgets
   */
  items: Budget[];

  /**
   * Has the user loaded the budgets
   */
  initialized: boolean;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Set all budgets to state
   */
  setBudgetsToState: Action<BudgetsModel, Budget[]>;

  /**
   * Add multiple budgets to state or if matching budgets by ID already
   * exists in state, change them.
   */
  upsertBudgetsToState: Action<BudgetsModel, Budget[]>;

  /**
   * Removes budgets from the state
   */
  removeBudgetsFromStateById: Action<BudgetsModel, string[]>;

  /**
   * Clears the state
   */
  clearState: Action<BudgetsModel, void>;

  //==============================================================//
  // THUNKS
  //==============================================================//

  /**
   * Fetch all budgets for user from server
   */
  getBudgets: Thunk<
    BudgetsModel,
    Parameters<typeof BudgetService["getBudgets"]>[0],
    any,
    StoreModel,
    Promise<
      undefined | PromiseType<ReturnType<typeof BudgetService["getBudgets"]>>
    >
  >;

  /**
   * Post budget to state
   */
  postBudget: Thunk<
    BudgetsModel,
    Parameters<typeof BudgetService["postBudget"]>[0],
    any,
    StoreModel,
    ReturnType<typeof BudgetService["postBudget"]>
  >;

  /**
   * Delete and remove budget from state
   */
  deleteBudget: Thunk<
    BudgetsModel,
    string,
    any,
    StoreModel,
    ReturnType<typeof BudgetService["deleteBudget"]>
  >;

  /**
   * Put and update budget to state
   */
  putBudget: Thunk<
    BudgetsModel,
    Parameters<typeof BudgetService["putBudget"]>[0],
    any,
    StoreModel,
    ReturnType<typeof BudgetService["putBudget"]>
  >;

  /**
   * Patch and update budget to state
   */
  patchBudget: Thunk<
    BudgetsModel,
    Parameters<typeof BudgetService["patchBudget"]>[0],
    any,
    StoreModel,
    ReturnType<typeof BudgetService["patchBudget"]>
  >;

  //==============================================================//
  // LISTENERS
  //==============================================================//

  /**
   * Clear data on logout
   */
  onLogout: ThunkOn<BudgetsModel, any, StoreModel>;
}

export const budgetsModel: BudgetsModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  items: [],
  initialized: false,

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setBudgetsToState: action((state, payload) => {
    state.items = payload;
    state.initialized = true;
  }),

  upsertBudgetsToState: action((state, budgets) => {
    budgets.forEach((budget) => {
      // Update budget if one with similary ID already exists
      if (state.items.find((_) => _.id === budget.id)) {
        state.items = state.items.map((_) => {
          return _.id === budget.id ? budget : _;
        });
      }
      // Else add budget if new budget based on ID
      else {
        state.items.push(budget);
      }
    });
  }),

  removeBudgetsFromStateById: action((state, ids) => {
    state.items = state.items.filter((budget) => {
      return !ids.includes(budget.id);
    });
  }),

  clearState: action((state) => {
    state.items = [];
  }),

  //==============================================================//
  // THUNKS
  //==============================================================//

  getBudgets: thunk(async (actions, payload) => {
    const result = await BudgetService.getBudgets(payload);
    if (result.isSuccess()) {
      actions.setBudgetsToState(result.value.map((json) => new Budget(json)));
    } else {
      actions.setBudgetsToState([]);
    }
    return result;
  }),

  postBudget: thunk(async (actions, json) => {
    const result = await BudgetService.postBudget(json);
    if (result.isSuccess()) {
      const budget = new Budget(result.value);
      actions.upsertBudgetsToState([budget]);
    }
    return result;
  }),

  deleteBudget: thunk(async (actions, id, { getState, getStoreActions }) => {
    // Get budget and ensure one exists
    const budget = getState().items.find((_) => _.id === id);

    // Delete the budget
    actions.removeBudgetsFromStateById([id]);
    const result = await BudgetService.deleteBudget(id);

    // If deletion succeeds, create deletion event
    if (result.isSuccess() && budget) {
      getStoreActions().history.pushEvent(new DeleteBudgetEvent(budget));
    }

    // If deletion fails, put budget back
    if (result.isFailure() && budget) {
      actions.upsertBudgetsToState([budget]);
    }
    return result;
  }),

  putBudget: thunk(async (actions, json, store) => {
    const result = await BudgetService.putBudget(json);
    if (result.isSuccess()) {
      const budget = new Budget(result.value);
      actions.upsertBudgetsToState([budget]);
    }
    return result;
  }),

  patchBudget: thunk(async (actions, json, store) => {
    const result = await BudgetService.patchBudget(json);
    if (result.isSuccess()) {
      const budget = new Budget(result.value);
      actions.upsertBudgetsToState([budget]);
    }
    return result;
  }),

  //==============================================================//
  // LISTENERS
  //==============================================================//

  onLogout: thunkOn(
    (_, store) => store.auth.logout,
    (actions) => {
      actions.clearState();
    }
  ),
};
