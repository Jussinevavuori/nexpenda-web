/**
 * JSON app config schema type
 */
type JsonAppConfig = import("zod").TypeOf<
  typeof import("../lib/DataModels/AppConfig").AppConfig["Schema"]
>;
