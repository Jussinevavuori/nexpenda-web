import { DateSerializer } from "./DateSerializer";

export type DateCompareOperator = ">" | ">=" | "==" | "<=" | "<";

/**
 * Utility function to compare two dates, where only the date is taken into
 * account, not the time. If an operator is given, will return a boolean value,
 * else will return a numerical value of the comparison as the difference in
 * days.
 *
 * @param a  Left hand operator date
 * @param op Operator to specify which comparison to run (optional)
 * @param b  Right hand operator date
 */
export function compareDate(a: Date, op: DateCompareOperator, b: Date): boolean;
export function compareDate(a: Date, b: Date): number;
export function compareDate(
  ...args: [Date, DateCompareOperator, Date] | [Date, Date]
): boolean | number {
  // Get dates and optional operator
  const [a, b] = args.length === 3 ? [args[0], args[2]] : [args[0], args[1]];
  const op = args.length === 3 ? args[1] : undefined;

  // Serialize dates for easy comparison
  const _a = DateSerializer.serializeDate(a);
  const _b = DateSerializer.serializeDate(b);

  // If no operator given, return number which has sign corresponding to the
  // difference of those dates.
  if (!op) {
    return _a - _b;
  }

  // Else return boolean corresponding to result of comparison by operator.
  switch (op) {
    case "<":
      return _a < _b;
    case "<=":
      return _a <= _b;
    case "==":
      return _a === _b;
    case ">=":
      return _a >= _b;
    case ">":
      return _a > _b;
  }
}
