import { v4 as uuid } from "uuid";

type Subscriber<Publisher extends (...args: any[]) => any> = (
  event: ReturnType<Publisher>
) => any;

export class PubSubChannel<Publisher extends (...args: any[]) => any> {
  /**
   * Publisher function to publish an event.
   */
  private readonly publisher: Publisher;

  /**
   * All listeners.
   */
  private _listeners: Record<string, Subscriber<Publisher>>;

  constructor(publisher: PubSubChannel<Publisher>["publisher"]) {
    this.publisher = publisher;
    this._listeners = {};
  }

  /**
   * Get all listeners.
   */
  getListeners() {
    return this._listeners;
  }

  /**
   * Subscribe a new listener (returns an unsubscription function).
   */
  subscribe(listener: Subscriber<Publisher>) {
    const id = uuid();
    this._listeners[id] = listener;
    return () => {
      try {
        if (this._listeners[id]) {
          delete this._listeners[id];
          return;
        }
        return;
      } catch (e) {
        return;
      }
    };
  }

  /**
   * Publish to all listeners.
   */
  publish(...args: Parameters<Publisher>) {
    const broadcast = this.publisher(...args);
    for (const listener of Object.values(this._listeners)) {
      listener(broadcast);
    }
  }
}

/**
 * When given a subscribable, returns which type of listener the
 * subscribable is expecting.
 */
export type ListenerType<S> = S extends PubSubChannel<infer T>
  ? (event: ReturnType<T>) => any
  : never;
