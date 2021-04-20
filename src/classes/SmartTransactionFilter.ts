import { DataUtils } from "../utils/DataUtils/DataUtils";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { Category } from "./Category";
import { Transaction } from "./Transaction";
import { lightFormat } from "date-fns";
import { LogService } from "../services/LogService";

export class SmartTransactionFilter {
  public readonly search: string;
  public readonly context: {
    categories: Category[];
    startDate: Date;
    endDate: Date;
  };
  public readonly matchCategories: Category[];
  public readonly originalSearch: string;
  public readonly isEmpty: boolean;

  constructor(search: string, context: SmartTransactionFilter["context"]) {
    this.originalSearch = search;
    this.context = context;

    this.matchCategories = SmartTransactionFilter.getCategoriesFromSearch(
      search,
      context
    );

    this.search = SmartTransactionFilter.removeValuesFromSearch(search, [
      SmartTransactionFilter.categoryPrefix,
    ])
      .trim()
      .replace(/\s+/g, " ");

    this.isEmpty = !this.search && this.matchCategories.length === 0;
  }

  /**
   * Function to compare whether a transaction matches the current filter
   */
  compare(transaction: Transaction) {
    // Match by start date
    if (DateUtils.compareDate(transaction.date, "<", this.context.startDate)) {
      return false;
    }

    // Match by end date
    if (DateUtils.compareDate(transaction.date, ">", this.context.endDate)) {
      return false;
    }

    // Match by categories
    if (this.matchCategories.length > 0) {
      if (!this.matchCategories.some((_) => _.id === transaction.category.id)) {
        return false;
      }
    }

    // Match by raw search
    if (this.search) {
      const matchAny = [
        transaction.amount.format(),
        transaction.category.value,
        transaction.comment,
        lightFormat(transaction.date, "d.M.yyyy"),
      ];
      if (!DataUtils.textSearch(this.search, ...matchAny)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Prefix from values separator <prefix>:<values>
   */
  static prefixSeparator = ":";

  /**
   * Value from value separator <value_1>;<value_2>
   */
  static valuesSeparator = ";";

  /**
   * Returns the search string with all smart filters removed
   *
   * @param search Original search string
   * @param prefixes Smart filters to remove
   */
  static removeValuesFromSearch(search: string, prefixes: string[]) {
    let result = search;

    const sep = SmartTransactionFilter.prefixSeparator;

    prefixes.forEach((prefix) => {
      // eslint-disable-next-line
      const regexp = new RegExp(`${prefix}${sep}([^\\s]+)`, "gmi");
      const match = search.match(regexp);
      if (!match) return;

      const matchString = match[0];
      if (!matchString) return;

      result = result.replace(matchString, "");
    });

    return result;
  }

  /**
   * Extracts a value from a search string with a specific prefix. For example,
   * from the search string `"something category:example"`, the function
   * would extract the value `["example"]` for the prefix `"category"`.
   *
   * Returns `undefined` when no value can be found. Multiple values can also
   * be returned when they are separated with the `;`-character. For example for
   * the search string `"something test:one;two;three"` the function would
   * return the value `["one","two","three"]` for the prefix `"test"`
   *
   * @param search The search string
   * @param prefix The prefix to get the value for
   */
  static getValuesFromSearch(search: string, prefix: string): string[] {
    try {
      // Prefix-value separator character and value-value separator character
      const prefixSep = SmartTransactionFilter.prefixSeparator;
      const valueSep = SmartTransactionFilter.valuesSeparator;

      // Construct regexp and match
      // eslint-disable-next-line
      const regexp = new RegExp(`${prefix}${prefixSep}([^\\s]+)`, "gmi");
      const match = search.match(regexp);

      // Extract values
      return match?.[0]?.split(prefixSep)?.[1]?.split(valueSep) ?? [];
    } catch (error) {
      LogService.warn({
        message: `An error occured while extracting value from "${search}" with prefix ${prefix}:`,
        data: { error },
      });
      return [];
    }
  }

  /**
   * Category prefix
   */
  static categoryPrefix = "category";

  /**
   * Finds the categories corresponding to the transaction filter
   */
  static getCategoriesFromSearch(
    search: string,
    context: SmartTransactionFilter["context"]
  ): Category[] {
    const prefix = SmartTransactionFilter.categoryPrefix;
    const values = SmartTransactionFilter.getValuesFromSearch(search, prefix);
    const slugs = values.map((v) => v.toLowerCase().replace(/\s+/g, "-"));

    let categories: Category[] = [];

    slugs.forEach((slug) => {
      const category = context.categories.find((_) => _.slug === slug);
      if (category) {
        categories.push(category);
      }
    });

    return categories;
  }

  /**
   * Set the category in the original search
   */
  getSearchTermWithCategory(category: Category[] | Category | undefined) {
    let search = this.search;

    // All categories as an array
    const categories = Array.isArray(category)
      ? category
      : category
      ? [category]
      : [];

    // Prepend category if one defined
    if (categories.length > 0) {
      const prefix = SmartTransactionFilter.categoryPrefix;
      const prefixSep = SmartTransactionFilter.prefixSeparator;
      const valuesSep = SmartTransactionFilter.valuesSeparator;
      const values = categories.map((_) => _.slug);
      search = `${prefix}${prefixSep}${values.join(valuesSep)}`;
    }

    return search;
  }
}
