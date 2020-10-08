export class Process<T> {
  readonly process: () => T | Promise<T>;

  constructor(process: () => T | Promise<T>) {
    this.process = process;
  }

  async run() {
    return this.process();
  }
}
