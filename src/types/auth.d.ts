/**
 * JSON auth schema type
 */
type JsonAuth = import("zod").TypeOf<
  typeof import("../lib/DataModels/Auth").Auth["Schema"]
>;

/**
 * All updatable auth object fields
 */
type AuthUpdater = Partial<
  Pick<JsonAuth, "displayName" | "themeColor" | "themeMode">
>;
