import { clamp } from "./clamp";

/**
 * Map a value from one range to another.
 *
 * @param value		Value to map
 * @param oldMin	Minimum of value's original range
 * @param oldMax	Maximum of value's original range
 * @param newMin	Minimum of target range
 * @param newMax	Maximum of target range
 * @param options	Should the value be clamped
 *
 * @returns Mapped value
 */
export function mapValue(
  value: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
  options: { clamp?: boolean } = {}
) {
  let v = value;

  const oldRng = oldMax - oldMin; // Old range
  const newRng = newMax - newMin; // New range

  v -= oldMin; // Translate to start from 0
  v /= oldRng; // Normalize to range between 0 and 1
  v *= newRng; // Scale to new range
  v += newMin; // Translate to new position

  if (options.clamp) v = clamp(v, newMin, newMax); // Clamp

  return v;
}
