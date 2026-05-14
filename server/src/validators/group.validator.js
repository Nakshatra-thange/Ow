import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Group name too short"),

  description: z
    .string()
    .optional(),
});