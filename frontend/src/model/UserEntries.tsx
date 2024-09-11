import { RefinementCtx, z } from "zod";
import { UTCDate } from "@date-fns/utc";

export type UserEntries = {
  entries: string[];
  id?: number;
};

export type DateAndMealType = {
  mealType: string;
  date: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUserEntriesSchema = z.object({
  date: z.string().date(),
  meal: z.string(),
  entries: z.array(z.string()),
});

export type CreateUserEntries = z.infer<typeof createUserEntriesSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUserEntriesSchema = z.object({
  meal: z.string(),
  entries: z.array(z.string()),
});

export type UpdateUserEntries = z.infer<typeof updateUserEntriesSchema>;

const entriesSchema = z
  .object({
    breakfast: z.array(z.string()).default([]),
    lunch: z.array(z.string()).default([]),
    dinner: z.array(z.string()).default([]),
    snacks: z.array(z.string()).default([]),
    drinks: z.array(z.string()).default([]),
  })
  .partial();

export type Entries = z.infer<typeof entriesSchema>;

export const diaryEntrySchema = z.object({
  id: z.number(),
  userId: z.number(),
  date: z.string().transform((dateString: string, ctx: RefinementCtx) => {
    const result = z.string().date().safeParse(dateString.substring(0, 10));
    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
      });
      return z.NEVER;
    } else {
      return new UTCDate(result.data);
    }
  }),
  entries: entriesSchema,
});

export type DiaryEntry = z.infer<typeof diaryEntrySchema>;

export type AddingOrEditingMealType = UserEntries & DateAndMealType;

export type UserData = {
  [key: string]: DiaryEntry;
};
