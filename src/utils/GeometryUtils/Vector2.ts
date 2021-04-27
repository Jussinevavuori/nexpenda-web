type Vector2LikeArgs = [Vector2] | [number, number];

/**
 * Immutable 2D vector class.
 */
export class Vector2 {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Parses a Vector2LikeArgs into a Vector2
   */
  private parseArgs(...args: Vector2LikeArgs) {
    return args.length === 1 ? args[0] : new Vector2(...args);
  }

  /**
   * Add multiple vectors
   */
  static add(...vectors: Vector2[]) {
    const x = vectors.reduce((x, vec) => x + vec.x, 0);
    const y = vectors.reduce((y, vec) => y + vec.y, 0);
    return new Vector2(x, y);
  }

  /**
   * Add another vector to this vector to create a new vector.
   */
  add(...args: Vector2LikeArgs) {
    const that = this.parseArgs(...args);
    return Vector2.add(this, that);
  }

  /**
   * Multiply this vector by another vector to create another vector.
   */
  mult(factor: number) {
    return new Vector2(this.x * factor, this.y * factor);
  }
}
