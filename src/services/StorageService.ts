export type StorageServiceOptions = {
  storage: "local" | "session";
};

export class StorageService {
  /**
   * Gets the selected storage based on the options
   */
  protected static getStorage(options: StorageServiceOptions) {
    switch (options.storage) {
      case "local":
        return window.localStorage;
      case "session":
        return window.sessionStorage;
    }
  }

  /**
   * Get an item from the storage
   */
  protected static getItem(key: string, options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    return storage.getItem(key);
  }

  /**
   * Set an item to the storage
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
   * Remove an item from the storage
   */
  protected static removeItem(key: string, options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    return storage.removeItem(key);
  }

  /**
   * Clear the storage
   */
  protected static clear(options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    storage.clear();
  }

  /**
   * Creates a component setter and getter
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

  public static get components() {
    return {
      hadAccessToken: StorageService.hadAccessToken,
      apiUrlOverride: StorageService.apiUrlOverride,
    };
  }

  protected static get hadAccessToken() {
    return StorageService.createComponent<boolean>({
      key: "had_access_token",
      decode(value) {
        return value === "true";
      },
      encode(value) {
        return value ? "true" : undefined;
      },
      options: {
        storage: "session",
      },
    });
  }

  protected static get apiUrlOverride() {
    return StorageService.createComponent<string | undefined>({
      key: "api_url",
      decode(value) {
        return value || undefined;
      },
      encode(value) {
        return value;
      },
      options: {
        storage: "local",
      },
    });
  }
}
