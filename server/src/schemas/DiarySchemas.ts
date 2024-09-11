import { z } from "zod";
import { RefinementCtx } from "zod/lib/types";
import { meals } from "../constants/DiaryConstants";

function checkDate(dateString: string | Date, ctx: RefinementCtx): Date {
  const date = new Date(dateString);
  if (!z.date().safeParse(date).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
    });
    return z.NEVER;
  }
  return date;
}

export const getUserEntriesSchema = z.object({
  start: z.string().date().or(z.date()).transform(checkDate),
  end: z.string().date().or(z.date()).transform(checkDate),
});

export type GetUserEntries = z.infer<typeof getUserEntriesSchema>;

export const createUserEntriesSchema = z.object({
  date: z.string().date().or(z.date()).transform(checkDate),
  meal: z.string().refine((meal) => meals.includes(meal), {
    message: `invalid. Meal must be one of these values: ${meals.join(", ")}.`,
  }),
  entries: z.array(z.string()),
});

export const updateUserEntriesSchema = z.object({
  meal: z.string().refine((meal) => meals.includes(meal), {
    message: `invalid. Meal must be one of these values: ${meals.join(", ")}.`,
  }),
  entries: z.array(z.string()),
});
