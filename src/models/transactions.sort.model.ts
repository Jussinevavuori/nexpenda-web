import { action, Action } from "easy-peasy";

export type TransactionSortModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * Current sorting strategy
   */
  strategy: TransactionSortStrategy;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Toggle the current sorting strategy by a sorting property
   */
  toggle: Action<TransactionSortModel, TransactionSortableProperty>;

  /**
   * Directly set the current sorting strategy to the specified one
   */
  set: Action<TransactionSortModel, TransactionSortStrategy>;
};

export const transactionSortModel: TransactionSortModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  strategy: "date-descending",

  //==============================================================//
  // ACTIONS
  //==============================================================//

  toggle: action((state, property) => {
    // Define all carousels: each toggle on a property will toggle the sort to
    // the next sort state in the property's carousel, while clicking on any
    // other property will set it to the first sort state in the new property's
    // carousel.
    const carousels: Record<
      TransactionSortableProperty,
      TransactionSortStrategy[]
    > = {
      amount: ["amount-descending", "amount-ascending", "none"],
      category: ["category-descending", "category-ascending", "none"],
      comment: ["comment-descending", "comment-ascending", "none"],
      date: ["date-descending", "date-ascending", "none"],
    };

    // Get the current sort
    const currentStrategy = state.strategy;

    // Get the current carousel
    const carousel = carousels[property];

    // Figure out the index of the item in the carousel which is currently
    // active or default to -1 for "no item found"
    const activeSortIndex = carousel.findIndex((_) => _ === currentStrategy);

    // Get the next item's index in the carousel
    const targetSortIndex = (activeSortIndex + 1) % carousel.length;

    // Return the next item in the carousel
    state.strategy = carousel[targetSortIndex];
  }),

  set: action((state, sort) => {
    state.strategy = sort;
  }),
};
