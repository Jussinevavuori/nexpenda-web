import { DataUtils } from "../utils/DataUtils/DataUtils";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { Category } from "./Category";
import { Transaction } from "./Transaction";
import { lightFormat } from "date-fns";
import { SearchTermParser } from "./SearchTermParser";
import { MoneyAmountComparison } from "./MoneyAmountComparison";

/**
 * Class to enable parsing a search string into a complex matcher that filters
 * based on the
 *
 * 1. Selected date range
 * 2. Specified categories with `category:category-1;category-2` terms.
 * 3. Specified amount with `amount:>158,39;<200,00` terms.
 */
export class SmartTransactionFilter {
  /**
   * The cleaned search string where extra values have been removed and parsed
   * into the correct properties.
   */
  public readonly search: string;

  /**
   * Context (all categories and selected timerange) for filtering transactions.
   */
  public readonly context: {
    categories: Category[];
    startDate: Date;
    endDate: Date;
  };

  /**
   * All parsed categories.
   */
  public readonly categories: Category[];

  /**
   * All parsed money amount comparisons.
   */
  public readonly amountComparisons: MoneyAmountComparison[];

  /**
   * The original unparsed search term
   */
  public readonly originalSearch: string;

  /**
   * Check whether the filter is empty.
   */
  public readonly isEmpty: boolean;

  constructor(search: string, context: SmartTransactionFilter["context"]) {
    this.originalSearch = search;
    this.context = context;

    // Parse all extra data
    this.categories = SmartTransactionFilter.getCategories(search, context);
    this.amountComparisons =
      SmartTransactionFilter.getAmountComparisons(search);

    // Clean search
    this.search = SearchTermParser.removeValuesFromSearch(
      search,
      [
        SmartTransactionFilter.categoryPrefix,
        SmartTransactionFilter.amountComparisonPrefix,
      ],
      { clean: true }
    );

    // Check if the filter is empty
    this.isEmpty =
      !this.search &&
      this.categories.length === 0 &&
      this.amountComparisons.length === 0;
  }

  /**
   * ===========================================================================
   * TRANSACTION COMPARISON AND FILTERING UTILITIES
   * ===========================================================================
   */

  /**
   * Utility function for compare
   */
  private matchesDateRange(transaction: Transaction) {
    return (
      DateUtils.compareDate(transaction.date, ">=", this.context.startDate) &&
      DateUtils.compareDate(transaction.date, "<=", this.context.endDate)
    );
  }

  /**
   * Utility function for compare
   */
  private matchesCategories(transaction: Transaction) {
    return (
      this.categories.length === 0 ||
      this.categories.some((category) => {
        return category.id === transaction.category.id;
      })
    );
  }

  /**
   * Utility function for compare
   */
  private matchesAmountComparisons(transaction: Transaction) {
    return (
      this.amountComparisons.length === 0 ||
      this.amountComparisons.every((_) => _.compare(transaction.amount))
    );
  }

  /**
   * Utility function for compare
   */
  private matchesSearchTerm(transaction: Transaction) {
    const targets = [
      transaction.amount.format(),
      transaction.category.value,
      transaction.comment,
      lightFormat(transaction.date, "d.M.yyyy"),
    ];
    return DataUtils.textSearch(this.search, ...targets);
  }

  /**
   * Function to compare whether a transaction matches the current filter
   */
  compare(transaction: Transaction) {
    return (
      this.matchesDateRange(transaction) &&
      this.matchesCategories(transaction) &&
      this.matchesSearchTerm(transaction) &&
      this.matchesAmountComparisons(transaction)
    );
  }

  /**
   * ===========================================================================
   * CATEGORY MATCHING UTILITIES
   * ===========================================================================
   */

  /**
   * Category prefix for matching categories.
   */
  static categoryPrefix = "category";

  /**
   * Get all categories from a search (based on the categories provided in the
   * context object).
   */
  static getCategories(
    search: string,
    context: SmartTransactionFilter["context"]
  ): Category[] {
    // Find all category slugs
    const prefix = SmartTransactionFilter.categoryPrefix;
    const values = SearchTermParser.getValuesFromSearch(search, prefix);
    const slugs = values.map((v) => v.toLowerCase().replace(/\s+/g, "-"));

    // Match all slugs to categories if possible
    return slugs.reduce((categories, slug) => {
      const category = context.categories.find((_) => _.slug === slug);
      return category ? categories.concat(category) : categories;
    }, [] as Category[]);
  }

  /**
   * Set the category in the original search.
   *
   * @returns New search term.
   */
  setCategories(category: Category[] | Category = []): string {
    // All categories as an array
    const categories = Array.isArray(category) ? category : [category];

    return SearchTermParser.setValuesToSearch(
      this.search,
      SmartTransactionFilter.categoryPrefix,
      categories.map((_) => _.slug)
    );
  }

  /**
   * Does the search include the a category?
   *
   * @param category Category object or id
   */
  includesCategory(category: string | Category) {
    const categoryId = typeof category === "string" ? category : category.id;
    return this.categories.some((_) => _.id === categoryId);
  }

  /**
   * ===========================================================================
   * CATEGORY MATCHING UTILITIES
   * ===========================================================================
   */

  /**
   * Prefix for matching amount comparisons.
   */
  static amountComparisonPrefix = "amount";

  /**
   * Get all money amount comparisons from a search.
   */
  static getAmountComparisons(search: string): MoneyAmountComparison[] {
    // Find all comparisons and convert all valid ones into money amount
    // comparison instances
    const prefix = SmartTransactionFilter.amountComparisonPrefix;
    const values = SearchTermParser.getValuesFromSearch(search, prefix);
    return values.reduce((comparisons, value) => {
      const comparison = MoneyAmountComparison.fromString(value);
      return comparison ? [...comparisons, comparison] : comparisons;
    }, [] as MoneyAmountComparison[]);
  }
}
