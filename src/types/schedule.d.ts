/**
 * JSON schedule schema type
 */
type JsonSchedule = import("zod").TypeOf<
  typeof import("../lib/Schedules/Schedule").Schedule["Schema"]
>;
