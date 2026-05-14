import { z } from "zod";

const splitSchema = z.object({
  userId: z.string(),

  amountOwed: z
    .number()
    .positive("Amount owed must be positive"),
});

export const createExpenseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"),

  amount: z
    .number()
    .positive("Amount must be positive"),

  notes: z
    .string()
    .optional(),

  paidById: z.string(),

  splits: z
    .array(splitSchema)
    .min(1, "At least one split required"),
});