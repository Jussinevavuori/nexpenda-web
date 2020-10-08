import { Process } from "../Process/Process";

export type ProcessQueueProgress<T> = {
  results: T[];
  completed: number;
  remaining: number;
  total: number;
  chunksProcessed: number;
  chunksRemaining: number;
  chunksTotal: number;
};

export class ProcessQueue<T> {
  /**
   * All processes that have been queued to this queue
   */
  private _queue: Process<T>[];

  /**
   * How many items are processed at once
   */
  private _chunksize: number;

  /**
   * This can be used to update the progress
   */
  private _progressUpdater?: (progress?: ProcessQueueProgress<T>) => void;

  /**
   * Create new process queue and initialize queue
   *
   * @param options Override process queue options
   */
  constructor(options?: {
    chunksize?: number;
    queue?: Process<T>[];
    updateProgress?: (progress?: ProcessQueueProgress<T>) => void;
  }) {
    this._queue = options?.queue ?? [];
    this._chunksize = options?.chunksize
      ? Math.trunc(Math.abs(Math.max(options.chunksize, 1)))
      : ProcessQueue.defaultChunkSize;
    this._progressUpdater = options?.updateProgress;
  }

  /**
   * Get the queue
   */
  get queue() {
    return this._queue;
  }

  /**
   * Get the default chunk size
   */
  static get defaultChunkSize() {
    return 10;
  }

  /**
   * Add new processes to the queue
   */
  enqueue(...processes: Process<T>[]) {
    this._queue.push(...processes);
  }

  /**
   * Take a screenshot of the queue and execute all items in the queue.
   */
  run() {
    /**
     * Take a screenshot of all processes in queue and empty the queue.
     */
    const processes = [...this._queue];
    this._queue = [];

    /**
     * Construct all chunks of max `this.chunksize` processes each
     */
    const chunks: Process<T>[][] = [[]];

    for (const process of processes) {
      const chunk = chunks[chunks.length - 1];

      chunk.push(process);

      if (chunk.length === this._chunksize) {
        chunks.push([]);
      }
    }

    /**
     * Create and return new promise object which resolves after
     * all chunks have been processed.
     */
    return new Promise(async (resolve, reject) => {
      /**
       * Create progress object to track current progress
       */
      let progress: ProcessQueueProgress<T> = {
        results: [],
        completed: 0,
        remaining: processes.length,
        total: processes.length,
        chunksProcessed: 0,
        chunksRemaining: chunks.length,
        chunksTotal: chunks.length,
      };

      /**
       * Initial progress update
       */
      if (this._progressUpdater) {
        this._progressUpdater(progress);
      }

      /**
       * Run the processes a chunk at a time
       */
      for await (const chunk of chunks) {
        /**
         * Execute all processes simultaneously
         */
        const executions = chunk.map((process) => process.run());
        const results = await Promise.all(executions);
        const n = results.length;

        /**
         * Update progress object
         */
        progress = {
          results: progress.results.concat(results),
          completed: progress.completed + n,
          remaining: progress.remaining - n,
          total: progress.total,
          chunksProcessed: progress.chunksProcessed + 1,
          chunksRemaining: progress.chunksRemaining - 1,
          chunksTotal: progress.chunksTotal,
        };

        /**
         * Progress update
         */
        if (this._progressUpdater) {
          this._progressUpdater(progress);
        }
      }

      /**
       * Undefined progress update to signal ended process
       */
      if (this._progressUpdater) {
        this._progressUpdater();
      }
      resolve(progress.results);
    });
  }
}
