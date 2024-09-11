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
 * They key is a date in the format of "2024/9/23". The value is UserEntry
 */
export type UserEntryByDate = {
  [key: string]: UserEntry | undefined;
};

// TODO: In insert, check if the date already exists.
// If it does, just throw an error.
// Updating and getting.
