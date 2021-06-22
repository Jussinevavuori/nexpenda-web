import { LogService } from "../../services/LogService";

/**
 * Class for parsing data from search terms. Used by smart transaction filter.
 */
export class SearchTermParser {
  /**
   * Prefix from values separator <prefix>:<values>
   */
  static prefixSeparator = ":";

  /**
   * Value from value separator <value_1>;<value_2>
   */
  static valuesSeparator = ";";

  /**
   * Format a prefix and values into the correct format.
   *
   * No values: empty string.
   * One value: `<prefix>:<value>`
   * Many values: `<prefix>:<value1>;<value2>`
   */
  protected static formatValues(prefix: string, values: string | string[]) {
    // Make values an array
    const _values = Array.isArray(values) ? values : [values];

    // Empty: return nothing
    if (_values.length === 0) {
      return "";
    }

    // Get references to separators
    const prefixSep = SearchTermParser.prefixSeparator;
    const valuesSep = SearchTermParser.valuesSeparator;

    // Format as prefix + prefix separator + values separated by value separator
    return `${prefix}${prefixSep}${_values.join(valuesSep)}`;
  }

  /**
   * Returns the search string with all smart filters removed
   *
   * @param search Original search string
   * @param prefixes Smart filters to remove
   */
  static removeValuesFromSearch(
    search: string,
    prefixes: string[],
    options: { clean?: boolean } = {}
  ) {
    let result = search;

    const sep = SearchTermParser.prefixSeparator;

    prefixes.forEach((prefix) => {
      // eslint-disable-next-line
      const regexp = new RegExp(`${prefix}${sep}([^\\s]+)`, "gmi");
      const match = search.match(regexp);
      if (!match) return;

      const matchString = match[0];
      if (!matchString) return;

      result = result.replace(matchString, "");
    });

    // Clean if required by trimming and removing all multi-whitespace
    if (options.clean) {
      return result.trim().replace(/\s+/g, " ");
    }

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
      const prefixSep = SearchTermParser.prefixSeparator;
      const valueSep = SearchTermParser.valuesSeparator;

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
   * Take a search and set given values into the search for a given prefix.
   */
  static setValuesToSearch(
    search: string,
    prefix: string,
    values: string | string[]
  ): string {
    // Clean the search of the given prefix
    const cleanSearch = SearchTermParser.removeValuesFromSearch(search, [
      prefix,
    ]);

    // Combine all existing and provided values as a string
    const allValues = Array.isArray(values) ? values : [values];
    const formattedValues = SearchTermParser.formatValues(prefix, allValues);

    return `${cleanSearch} ${formattedValues}`;
  }

  /**
   * Take a search and append given values into the search for a given prefix.
   */
  static appendValuesToSearch(
    search: string,
    prefix: string,
    values: string | string[]
  ): string {
    // Clean the search of the given prefix
    const cleanSearch = SearchTermParser.removeValuesFromSearch(search, [
      prefix,
    ]);

    // Combine all existing and provided values as a string
    const existingValues = SearchTermParser.getValuesFromSearch(search, prefix);
    const allValues = existingValues.concat(
      Array.isArray(values) ? values : [values]
    );
    const formattedValues = SearchTermParser.formatValues(prefix, allValues);

    return `${cleanSearch} ${formattedValues}`;
  }
}
