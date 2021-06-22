import * as z from "zod";

// Full location state schema
export const locationStateSchema = z.object({
  object: z
    .object({
      type: z.enum(["transaction", "budget", "schedule"]),
      id: z.string().nonempty(),
      action: z.enum(["create", "edit", "delete", "view", "select"]),
    })
    .optional(),
});

// Type breakdown of location state
export type LocationState = z.TypeOf<typeof locationStateSchema>;
export type LocationStateObject = NonNullable<LocationState["object"]>;
export type LocationStateObjectType = LocationStateObject["type"];
export type LocationStateObjectId = LocationStateObject["id"];
export type LocationStateObjectAction = LocationStateObject["action"];
