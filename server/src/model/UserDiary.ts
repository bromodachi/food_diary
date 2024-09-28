type MealType = {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  drinks: string;
};

type MealEntries = {
  [key in keyof Partial<MealType>]: string[];
};
export type UserEntry = {
  id: number;
  userId: number;
  date: Date;
  entries: MealEntries;
};

/**
 * They key is a date in the format of YYYY-MM-DD(e.g. "2024-09-23"). The value is UserEntry
 */
export type UserEntryByDate = {
  [key: string]: UserEntry | undefined;
};
