import { ThemeUtils } from "../utils/ThemeUtils/ThemeUtils";
import { exposeToWindow } from "../utils/Utils/exposeToWindow";

export enum StorageType {
  Local,
  Session,
}

export type StorageServiceOptions = {
  storage: StorageType;
};

export class StorageService {
  //==============================================================//
  // INTERNALS
  //==============================================================//

  /**
   * Gets the selected storage based on the options.
   *
   * @param options		Storage options
   */
  protected static getStorage(options: StorageServiceOptions) {
    switch (options.storage) {
      case StorageType.Local:
        return window.localStorage;
      case StorageType.Session:
        return window.sessionStorage;
    }
  }

  /**
   * Get an item from the storage.
   *
   * @param key				Key of item to fetch from storage
   * @param options		Storage options
   */
  protected static getItem(key: string, options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    return storage.getItem(key);
  }

  /**
   * Set an item to the storage.
   *
   * @param key				Key of item to set to storage
   * @param value			Value to set to storage
   * @param options		Storage options
   */
  protected static setItem(
    key: string,
    value: string | undefined,
    options: StorageServiceOptions
  ) {
    const storage = StorageService.getStorage(options);
    if (typeof value === "string") {
      return storage.setItem(key, value);
    } else {
      return storage.removeItem(key);
    }
  }

  /**
   * Remove an item from the storage.
   *
   * @param key				Key of item to remove from storage
   * @param options		Storage options
   */
  protected static removeItem(key: string, options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    return storage.removeItem(key);
  }

  /**
   * Fully clear all values from the storage.
   *
   * @param options		Storage options
   */
  protected static clear(options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    storage.clear();
  }

  /**
   * Creates a storage component which has the following methods:
   * - `getKey()`     for getting the key of the component.
   * - `getValue()`   for fetching the current value of the component.
   * - `setValue()`   for setting the current value of the component.
   * - `clearValue()` for clearing the current value of the component.
   *
   * A component represents a single property in a storage (such as
   * localStorage) and represents it with a clear, centralized API.
   *
   * @param options 					Component options
   * @param options.key				Key of item to use in storage
   * @param options.encode		Function to encode a valid value into a
   * 													string / undefined representation which
   * 													will be stored in the storage.
   * @param options.decode		Function to decode the stringified result
   * 													of encode back into a valid value.
   * @param options.options		Storage options
   */
  protected static createComponent<T>(options: {
    key: string;
    decode(value: string | null): T;
    encode(t: T): string | undefined;
    options: StorageServiceOptions;
  }) {
    return {
      getKey() {
        return options.key;
      },
      getValue() {
        return options.decode(
          StorageService.getItem(options.key, options.options)
        );
      },
      setValue(t: T) {
        return StorageService.setItem(
          options.key,
          options.encode(t),
          options.options
        );
      },
      clearValue() {
        return StorageService.removeItem(options.key, options.options);
      },
    };
  }

  /**
   * Wrapper for `StorageService.createComponent` for easier and more readable
   * creation of boolean StorageService components. Automatically provides
   * encoder and decored functions such that the value "1" represents true
   * in local storage, while undefined or any other value represents false.
   *
   * @param options 				Component options
   * @param options.key 		Key to use for storing the component.
   * @param options.options Storage options.
   */
  protected static createBooleanComponent(options: {
    key: string;
    options: StorageServiceOptions;
  }) {
    const truthy = StorageService.DefaultTruthyValue;
    return StorageService.createComponent({
      ...options,
      decode: (value) => value === truthy,
      encode: (value) => (value ? truthy : undefined),
    });
  }

  /**
   * Value used by createBooleanComponent to represent a truthy value.
   */
  protected static DefaultTruthyValue = "1";

  //==============================================================//
  // COMPONENTS
  //==============================================================//

  /**
   * StorageService component:
   *
   * Represents a boolean value for whether the user has had an access token.
   */
  static hadAccessToken = StorageService.createBooleanComponent({
    key: "@nexpenda/hadAccessToken",
    options: { storage: StorageType.Session },
  });

  /**
   * StorageService component:
   *
   * Represents a boolean value for whether the user was logged in. If this is
   * true, the app will automatically attempt
   */
  static wasLoggedIn = StorageService.createBooleanComponent({
    key: "@nexpenda/wasLoggedIn",
    options: { storage: StorageType.Local },
  });

  /**
   * StorageService component:
   *
   * Represents the memorized latest selected theme. When a theme is selected,
   * it is stored here for quicker access and initialization of the application
   * theme. Validates the theme.
   */
  static latestSelectedTheme = StorageService.createComponent<
    Theme | undefined
  >({
    key: "@nexpenda/latestSelectedTheme",
    decode: (value) => (ThemeUtils.isTheme(value) ? value : undefined),
    encode: (value) => value,
    options: { storage: StorageType.Local },
  });

  /**
   * StorageService component:
   *
   * Manually used development property. Represents an alternative API URL,
   * which when provided manually to the localStorage will be used as the
   * API URL to connect to instead of the default URL.
   */
  static apiUrlOverride = StorageService.createComponent<string | undefined>({
    key: "@nexpenda/apiUrlOverride",
    decode: (value) => value || undefined,
    encode: (value) => value,
    options: { storage: StorageType.Local },
  });

  /**
   * Dynamic StorageService component:
   *
   * When the user dismisses a beta feature banner with the given key, the
   * application memorizes that into the localStorage using this component.
   * When this is set to true, the application should no longer display the
   * beta feature banner.
   *
   * @param feature Key of feature to check for.
   */
  static hasDismissedBetaFeatureBanner(feature: string) {
    return StorageService.createBooleanComponent({
      key: `@nexpenda/hasDismissedBetaFeatureBanner/${feature}`,
      options: { storage: StorageType.Local },
    });
  }
}

exposeToWindow({ StorageService, StorageType });
