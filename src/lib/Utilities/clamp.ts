/**
 * Utility clamp function. The minimum and maximum can be passed in either
 * order.
 *
 * @param value	Value to clamp
 * @param a 	Min or max value
 * @param b 	Max or max value
 * @returns 		Clamped value
 */
export function clamp(value: number, a: number, b: number) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
