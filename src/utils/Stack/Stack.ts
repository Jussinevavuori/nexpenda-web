export class Stack<T> {
  private items: T[];

  private _maxSize = Infinity;

  constructor(...items: T[]) {
    this.items = items;
  }

  /**
   * Create a shallow copy of this stack with a maxsize
   * attribute, which allows only a certain amount of items
   * in the stack, until items are removed from the bottom
   * of the stack.
   *
   * @param maxSize
   */
  withMaxSize(maxSize: number) {
    const newStack = new Stack(...this.items);
    newStack._maxSize = maxSize;
    return newStack;
  }

  /**
   * Return the current stack's max size. By default, unless
   * explicitly set, maxSize is infinite.
   */
  get maxSize() {
    return this._maxSize;
  }

  /**
   * Pops an item from the stack and returns it or undefined,
   * if no items in stack.
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Pushes an item onto the stack. If maxSize is reached, an
   * item is removed and returned, otherwise returns undefined.
   *
   * @param item
   */
  push(item: T): T | undefined {
    let removed: T | undefined;
    if (this.items.length === this._maxSize) {
      removed = this.items.shift();
    }
    this.items.push(item);
    return removed;
  }

  /**
   * Returns the next poppable element without popping it if any.
   */
  peek(): T | undefined {
    if (this.items.length === 0) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * Returns true when the stack is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
