/**
 * Enables exposing values to the window in development mode
 *
 * @param object Values to expose to the window object
 * 							 with their corresponding keys.
 */
export function exposeToWindow<T extends {}>(object: T) {
  if (process.env.NODE_ENV === "development") {
    for (const [key, value] of Object.entries(object)) {
      (window as any)[key] = value;
    }
  }
}
