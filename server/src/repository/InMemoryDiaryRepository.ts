import { addDays, startOfDay } from "date-fns";
import { UserEntry, UserEntryByDate } from "../model/UserDiary";
import { DiaryRepository } from "./DiaryRepository";
import DuplicateRequestError from "../errors/DuplicateRequestError";
import logger from "../utils/Logger";
import NotFoundError from "../errors/NotFoundError";

export class InMemoryDiaryRepository implements DiaryRepository {
  allUserEntries = new Map<number, UserEntry[]>();

  sharedVariable = 0;

  public getUserEntriesSortedByDate(userId: number): UserEntry[] {
    const userEntries = this.allUserEntries.get(userId) ?? [];
    return userEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  public getUserEntriesSortedById(userId: number): UserEntry[] {
    const userEntries = this.allUserEntries.get(userId) ?? [];
    return userEntries.sort((a, b) => a.id - b.id);
  }

  public addUserEntry(
    userId: number,
    date: Date,
    meal: string,
    entries: string[],
  ): UserEntry | undefined {
    const userEntriesByDate = this.getUserEntriesSortedByDate(userId);
    const index = this.findByDate(date, userEntriesByDate);
    if (index !== -1) {
      throw new DuplicateRequestError({
        message: "Duplicate date detected, you must update the entry instead!",
      });
    }
    const userEntry = {
      id: ++this.sharedVariable,
      userId: userId,
      date: date,
      entries: {
        [meal]: entries,
      },
    };
    if (!this.allUserEntries.has(userId)) {
      this.allUserEntries.set(userId, []);
    }
    this.allUserEntries.get(userId)!!.push(userEntry);
    return { ...userEntry };
  }

  private padZero(num: number): string {
    if (num < 10) {
      return "0" + num;
    }
    return "" + num;
  }

  private getDateString(date: Date): string {
    return (
      date.getFullYear() +
      "-" +
      this.padZero(date.getMonth() + 1) +
      "-" +
      this.padZero(date.getDate())
    );
  }

  public getEntriesRange(
    userId: number,
    from: Date,
    to: Date,
  ): UserEntryByDate {
    let startOfFrom = startOfDay(from);
    const startOfTo = startOfDay(to);
    const userEntriesByDate = this.getUserEntriesSortedByDate(userId);

    const userEntriesByDatesRequested: UserEntryByDate = {};

    while (startOfFrom.getTime() <= startOfTo.getTime()) {
      const index = this.findByDate(startOfFrom, userEntriesByDate);
      if (index === -1) {
        userEntriesByDatesRequested[this.getDateString(startOfFrom)] =
          undefined;
      } else {
        userEntriesByDatesRequested[this.getDateString(startOfFrom)] = {
          ...userEntriesByDate[index],
        };
      }
      startOfFrom = addDays(startOfFrom, 1);
    }
    return userEntriesByDatesRequested;
  }

  private binarySearch<T, R>(
    entries: R[],
    compare: (current: R) => number,
  ): number {
    let left = 0;
    let right = entries.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const compared = compare(entries[mid]);
      if (compared === 0) {
        return mid;
      } else if (compared > 0) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return -1;
  }

  private findById(id: number, entries: UserEntry[]): number {
    return this.binarySearch(entries, (entry: UserEntry) => {
      if (entry.id === id) {
        return 0;
      } else if (entry.id > id) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  private findByDate(date: Date, entries: UserEntry[]): number {
    return this.binarySearch(entries, (entry: UserEntry) => {
      const entryTime = startOfDay(entry.date).getTime();
      const targetTime = startOfDay(date).getTime();
      if (entryTime === targetTime) {
        return 0;
      } else if (entryTime > targetTime) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  public deleteUserEntry(userId: number, id: number): boolean {
    if (
      !this.allUserEntries.has(userId) ||
      this.allUserEntries.get(userId)!!.length === 0
    ) {
      return false;
    }
    const userEntries = this.getUserEntriesSortedById(userId);
    if (!userEntries) {
      return false;
    }
    const index = this.findById(id, userEntries);
    if (index == -1) {
      return false;
    }
    userEntries.splice(index, 1);
    this.allUserEntries.set(userId, userEntries);
    return true;
  }

  public updateUserEntry(
    userId: number,
    id: number,
    meal: string,
    entries: string[],
  ): UserEntry | undefined {
    if (
      !this.allUserEntries.has(userId) ||
      this.allUserEntries.get(userId)!!.length === 0
    ) {
      logger.warn(`user, ${userId}, doesn't have any entries.`);
      throw new NotFoundError({
        message: `No entries found.`,
      });
    }
    const userEntries = this.getUserEntriesSortedById(userId);
    const index = this.findById(id, userEntries);
    if (index === -1) {
      logger.warn(`user, ${userId}, doesn't have any entries for id ${id}.`);
      throw new NotFoundError({
        message: `Attempting to update an entry that doesn't exists.`,
      });
    }
    const updatedEntries = { ...userEntries[index].entries, [meal]: entries };
    userEntries[index] = {
      ...userEntries[index],
      entries: updatedEntries,
    };
    this.allUserEntries.set(userId, userEntries);
    return { ...userEntries[index] };
  }
}
