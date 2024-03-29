import { z } from "zod";

export const scheduleFormFieldSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
  every: z.number().int().positive(),
  occurrences: z.number().int().min(0),
  occurrencesEnabled: z.boolean(),
});

export type ScheduleFormType = z.TypeOf<typeof scheduleFormFieldSchema>;

export const defaultScheduleFormField: ScheduleFormType = {
  enabled: false,
  type: "MONTH",
  every: 1,
  occurrencesEnabled: false,
  occurrences: 0,
};
