import { action, Action, computed, Computed } from "easy-peasy";
import { Transaction } from "../classes/Transaction";
import { StoreModel } from "../store";

export type SelectionModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * IDs of all selected transactions
   */
  selectionIds: string[];

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  /**
   * All selected transactions
   */
  selection: Computed<SelectionModel, Transaction[], StoreModel>;

  /**
   * Is a selection active?
   */
  selectionActive: Computed<SelectionModel, boolean>;

  /**
   * How many items are selected
   */
  selectionLength: Computed<SelectionModel, number>;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Select by ID
   */
  select: Action<SelectionModel, string>;

  /**
   * Deselect by ID
   */
  deselect: Action<SelectionModel, string>;

  /**
   * Select all by list of IDs
   */
  selectAll: Action<SelectionModel, string[]>;

  /**
   * Deselect all in state
   */
  deselectAll: Action<SelectionModel, void>;
};

export const selectionModel: SelectionModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  selectionIds: [],

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  selection: computed(
    [
      (selectionState, storeState) => storeState.transactions.items,
      (selectionState, storeState) => selectionState.selectionIds,
    ],
    (transactions, selectionIds) => {
      const selectedTransactions: Transaction[] = [];
      selectionIds.forEach((id) => {
        const transaction = transactions.find((_) => _.id === id);
        if (transaction) {
          selectedTransactions.push(transaction);
        }
      });
      return selectedTransactions;
    }
  ),

  selectionActive: computed((state) => state.selection.length > 0),

  selectionLength: computed((state) => state.selection.length),

  //==============================================================//
  // ACTIONS
  //==============================================================//

  select: action((state, id) => {
    state.selectionIds.push(id);
  }),

  deselect: action((state, id) => {
    state.selectionIds = state.selectionIds.filter((_) => _ !== id);
  }),

  selectAll: action((state, ids) => {
    state.selectionIds = ids;
  }),

  deselectAll: action((state) => {
    state.selectionIds = [];
  }),
};
