/**
 * Get date range from a list of dates
 *
 * @param dates
 * @returns
 */
export function datesToDateRange(dates: Date[]) {
  const values = dates.map((_) => _.valueOf()).filter(Boolean);

  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    min: new Date(min),
    max: new Date(max),
  };
}
