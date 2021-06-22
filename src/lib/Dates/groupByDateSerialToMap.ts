import { DateSerializer } from "./DateSerializer";

/**
 * Groups items by their dates into map, where the key is the date serial
 * for that date.
 *
 * @param items 	List of all items
 * @param getDate Function to extract the date from an item
 */
export function groupByDateSerialToMap<T>(
  items: T[],
  getDate: (t: T) => Date
): { [dateSerial: number]: T[] } {
  return items.reduce((res, item) => {
    const date = getDate(item);
    const serial = DateSerializer.serializeDate(date);

    const group = res[serial] ?? [];

    return { ...res, [serial]: [...group, item] };
  }, {} as { [dateSerial: number]: T[] });
}
