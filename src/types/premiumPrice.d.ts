/**
 * JSON premium price schema type
 */
type JsonPremiumPrice = import("zod").TypeOf<
  typeof import("../lib/DataModels/PremiumPrice").PremiumPrice["Schema"]
>;
