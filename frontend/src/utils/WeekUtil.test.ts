import { expect, test } from "@jest/globals";
import { getWeek } from "@/utils/WeekUtil";
import { addDays, startOfDay } from "date-fns";
import { UTCDate } from "@date-fns/utc";

test("Get the week of days of week for September 13th, a Friday", () => {
  const days = getWeek(new Date(2024, 8, 13));
  // September 8, 2024
  const tempDay = startOfDay(new UTCDate(2024, 8, 8));
  const expectedDays = [tempDay];
  for (let i = 1; i < 7; i++) {
    expectedDays.push(addDays(tempDay, i));
  }
  expect(days).toEqual(expectedDays);
});

test("For any day of the week of september 8th, should give us the correct remaining of the week", () => {
  for (let i = 8; i <= 13; i++) {
    const days = getWeek(new Date(2024, 8, i));
    // September 8, 2024
    const tempDay = startOfDay(new UTCDate(2024, 8, 8));
    const expectedDays = [tempDay];
    for (let i = 1; i < 7; i++) {
      expectedDays.push(addDays(tempDay, i));
    }
    expect(days).toEqual(expectedDays);
  }
});

test("Given a a week in August, it should also give us the weekday of that week", () => {
  const days = getWeek(new Date(2024, 7, 13));
  // August 11, 2024
  const tempDay = startOfDay(new UTCDate(2024, 7, 11));
  const expectedDays = [tempDay];
  for (let i = 1; i < 7; i++) {
    expectedDays.push(addDays(tempDay, i));
  }
  expect(days).toEqual(expectedDays);
});
