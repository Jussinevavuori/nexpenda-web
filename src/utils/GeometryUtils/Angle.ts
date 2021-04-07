/**
 * Union of all angle units
 */
export type AngleUnit = "percentages" | "units" | "degrees" | "radians";

export class Angle {
  /**
   * Private value stored as unitary value, where 0 corresponds
   * to 0 degrees and 1 corresponds to 360 degrees.
   */
  private _value: number;

  /**
   * Construct a new angle representation. Can be given an angle
   * and a value as separate arguments or in an object.
   */
  constructor(value: number, unit: AngleUnit) {
    this._value = Angle.parseToInternalValue(value, unit);
  }

  /**
   * Get the angle's value in degrees
   */
  get degrees() {
    return this._value * Angle.DegreesRatio;
  }

  /**
   * Get the angle's value in units
   */
  get units() {
    return this._value * Angle.UnitsRatio;
  }

  /**
   * Get the angle's value in percentages
   */
  get percentages() {
    return this._value * Angle.PercentagesRatio;
  }

  /**
   * Get the angle's value in radians
   */
  get radians() {
    return this._value * Angle.RadiansRatio;
  }

  /**
   * Add a given amount in the specified unit to this angle.
   */
  static add(...angles: Angle[]): Angle {
    return new Angle(
      angles.reduce((sum, angle) => sum + angle.units, 0),
      "units"
    );
  }

  /**
   * Multiply this angle by a given factor
   */
  static multiply(angle: Angle, factor: number): Angle {
    return new Angle(angle.units * factor, "units");
  }

  /**
   * Check if two or more angles are equal. Here we consider
   * the internal values 0 and 1 equal.
   */
  static equals(...angles: [Angle, Angle, ...Angle[]]): boolean {
    return angles.every((angle) => angle._value % 1 === angles[0]._value % 1);
  }

  /**
   * Ratio of units to internal value
   */
  protected static UnitsRatio = 1;

  /**
   * Ratio of degrees to internal value
   */
  protected static DegreesRatio = 360;

  /**
   * Ratio of percentages to internal value
   */
  protected static PercentagesRatio = 100;

  /**
   * Ratio of radians to internal value
   */
  protected static RadiansRatio = 2 * Math.PI;

  /**
   * Clamp an internal value between 0 and 1 exclusive
   */
  protected static normalizeInternalValue(value: number) {
    if (value === 0) return 0;

    // Handle include 1 separately
    if (value % 1 === 0) return 1;

    // General case (fails to include 1)
    return (1 + (value % 1)) % 1;
  }

  /**
   * Parse a value in the given unit to an internal value
   */
  protected static parseToInternalValue(value: number, unit: AngleUnit) {
    switch (unit) {
      case "degrees":
        return Angle.normalizeInternalValue(value / Angle.DegreesRatio);
      case "radians":
        return Angle.normalizeInternalValue(value / Angle.RadiansRatio);
      case "units":
        return Angle.normalizeInternalValue(value / Angle.UnitsRatio);
      case "percentages":
        return Angle.normalizeInternalValue(value / Angle.PercentagesRatio);
    }
  }
}
