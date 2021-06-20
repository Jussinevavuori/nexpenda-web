import * as z from "zod";

export const scheduleFormFieldSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
  every: z.number().int().positive(),
  occurrences: z.number().int().min(0),
});

export type ScheduleFormType = z.TypeOf<typeof scheduleFormFieldSchema>;

export const defaultScheduleFormField: ScheduleFormType = {
  enabled: false,
  type: "DAY",
  every: 0,
  occurrences: 0,
};
