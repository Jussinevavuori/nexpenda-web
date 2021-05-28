import { Failure } from "./Failure";
import { v4 as uuid } from "uuid";
import { exposeToWindow } from "../utils/Utils/exposeToWindow";

export class FailureCache {
  /**
   * Default cache instance
   */
  static DefaultCache = new FailureCache();

  /**
   * All cached items
   */
  private items: Array<{ failure: Failure<any, any>; time: Date; id: string }>;

  /**
   * Time-to-live for each item
   */
  private readonly timeout: number;

  constructor(options: { timeout?: number } = {}) {
    this.items = [];
    this.timeout = options.timeout ?? FailureCache.defaultTimeout;
  }

  /**
   * Default timeout: by default logs expire after two minutes.
   */
  static defaultTimeout = 120_000;

  /**
   * Add an item
   */
  add(failure: Failure<any, any>) {
    const id = uuid();
    this.items.push({
      failure,
      id,
      time: new Date(),
    });
    return id;
  }

  /**
   * Add an item to the default cache
   */
  static add(failure: Failure<any, any>) {
    return FailureCache.DefaultCache.add(failure);
  }

  /**
   * Clean all expired items
   */
  clean() {
    const now = new Date().getTime();
    this.items = this.items.filter((item) => {
      const age = now - item.time.getTime();
      return age < this.timeout;
    });
  }

  /**
   * Clean all expired items from the default cache
   */
  static clean() {
    return FailureCache.DefaultCache.clean();
  }

  /**
   * Get a failure by its ID
   */
  get(id: string) {
    return this.items.find((_) => _.id === id);
  }

  /**
   * Get a failure by its ID from the default cache
   */
  static get(id: string) {
    return FailureCache.DefaultCache.get(id);
  }

  /**
   * Get all failures in the cache
   */
  getAll() {
    return this.items;
  }

  /**
   * Get all failure in the default cache
   */
  static getAll() {
    return FailureCache.DefaultCache.getAll();
  }
}

/**
 * Clean failure cache every default timeout.
 */
window.setInterval(() => {
  FailureCache.clean();
}, FailureCache.defaultTimeout);

exposeToWindow({ FailureCache });
