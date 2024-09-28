import { expect, test } from "@jest/globals";
import { getWeek } from "@/utils/WeekUtil";
import { addDays, startOfDay } from "date-fns";
import { UTCDate } from "@date-fns/utc";

test("Get the days in the week of September 13th, a Friday", () => {
  const days = getWeek(new Date(2024, 8, 13));
  // September 8, 2024
  const tempDay = startOfDay(new UTCDate(2024, 8, 8));
  const expectedDays = [tempDay];
  for (let i = 1; i < 7; i++) {
    expectedDays.push(addDays(tempDay, i));
  }
  expect(days).toEqual(expectedDays);
});

test("Get the days in the week of September 8th", () => {
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

test("Get the days in the week of August 13th", () => {
  const days = getWeek(new Date(2024, 7, 13));
  // August 11, 2024
  const tempDay = startOfDay(new UTCDate(2024, 7, 11));
  const expectedDays = [tempDay];
  for (let i = 1; i < 7; i++) {
    expectedDays.push(addDays(tempDay, i));
  }
  expect(days).toEqual(expectedDays);
});
