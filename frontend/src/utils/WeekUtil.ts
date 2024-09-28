import { addDays, startOfWeek } from "date-fns";
import { UTCDate } from "@date-fns/utc";

/**
 * Returns the date for a given week.
 * If null or undefined is given as a parameter,
 * we'll assume it's the current date.
 *
 * Uses UTC dates to avoid dealing with timezones(we only care about date and not datetime).
 * @param date
 */
export function getWeek(date: Date | undefined | null): Date[] {
  const d = date ?? new UTCDate();
  const utc = new UTCDate(d.getFullYear(), d.getMonth(), d.getDate());
  const utcDate = startOfWeek(utc);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const newDate = addDays(utcDate, i);
    dates.push(newDate);
  }
  return dates;
}
