export type DateCompareOperator = ">" | ">=" | "==" | "<=" | "<";

/**
 * Utility function to compare two dates, where only the date is taken into
 * account, not the time.
 *
 * @param a  Left hand operator date
 * @param op Operator to specify which comparison to run
 * @param b  Right hand operator date
 */
export function compareDate(a: Date, op: DateCompareOperator, b: Date) {
  // Serialize dates for easy comparison
  const _a = serializeDate(a);
  const _b = serializeDate(b);

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

/**
 * Helper function for above function to serialize dates, taking only into account
 * the date, month and year, not the time.
 *
 * @param date Date to serialize
 */
function serializeDate(date: Date) {
  return date.getFullYear() * 341 + date.getMonth() * 31 + date.getDate();
}
