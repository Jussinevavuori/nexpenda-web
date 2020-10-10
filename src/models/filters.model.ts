import { Action, action } from "easy-peasy";

export type FiltersModel = {
  /**
   * Current search term for matching transactions. Defaults
   * to empty string when unused.
   */
  searchTerm: string;

  /**
   * Current minimum amount for matching transactions.
   * Defaults to -Infinity when unused.
   */
  minAmount: number;

  /**
   * Current maximum amount for matching transactions.
   * Defaults to +Infinity when unused.
   */
  maxAmount: number;

  /**
   * Categories filter: when this is empty, all categories are shown.
   * Only when categories are included in this array, only those categories
   * will be shown.
   */
  categories: string[];

  /**
   * Reset all filters action
   */
  resetAll: Action<FiltersModel, void>;

  /**
   * Set search term action
   */
  setSearchTerm: Action<FiltersModel, string>;

  /**
   * Reset search term action
   */
  resetSearchTerm: Action<FiltersModel, void>;

  /**
   * Set amount filter action
   *
   * The first argument in the tuple will define a new minimum
   * amount limit if defined, else does not change minimum limit
   *
   * The second argument in the tuple will define a new maximum
   * amount limit if defined, else does not change maximum limit
   */
  setAmount: Action<FiltersModel, [number | undefined, number | undefined]>;

  /**
   * Reset amount filter action
   */
  resetAmount: Action<FiltersModel, void>;

  /**
   * Exclude a category
   */
  selectCategory: Action<FiltersModel, string | string[]>;

  /**
   * Include a category
   */
  deselectCategory: Action<FiltersModel, string>;

  /**
   * Reset excluded categories action
   */
  resetCategories: Action<FiltersModel, void>;
};

export const filtersModel: FiltersModel = {
  searchTerm: "",
  minAmount: Number.NEGATIVE_INFINITY,
  maxAmount: Number.POSITIVE_INFINITY,
  categories: [],

  resetAll: action((state) => {
    state.searchTerm = "";
    state.minAmount = Number.NEGATIVE_INFINITY;
    state.maxAmount = Number.POSITIVE_INFINITY;
    state.categories = [];
  }),

  setSearchTerm: action((state, value) => {
    state.searchTerm = value;
  }),

  resetSearchTerm: action((state) => {
    state.searchTerm = "";
  }),

  setAmount: action((state, [min, max]) => {
    if (typeof min === "number") {
      state.minAmount = min;
    }
    if (typeof max === "number") {
      state.maxAmount = max;
    }
  }),

  resetAmount: action((state) => {
    state.minAmount = Number.NEGATIVE_INFINITY;
    state.maxAmount = Number.POSITIVE_INFINITY;
  }),

  selectCategory: action((state, category) => {
    state.categories.push(...(Array.isArray(category) ? category : [category]));
  }),

  deselectCategory: action((state, category) => {
    state.categories = state.categories.filter((_) => _ !== category);
  }),

  resetCategories: action((state) => {
    state.categories = [];
  }),
};
