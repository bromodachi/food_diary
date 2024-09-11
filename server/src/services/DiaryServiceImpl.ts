import { DiaryRepository } from "../repository/DiaryRepository";
import { UserEntry, UserEntryByDate } from "../model/UserDiary";
import { DiaryService } from "./DiaryService";
import { meals } from "../constants/DiaryConstants";
import BadRequestError from "../errors/BadRequestError";
import DatabaseError from "../errors/DatabaseError";
import NotFoundError from "../errors/NotFoundError";

export class DiaryServiceImpl implements DiaryService {
  diaryRepository: DiaryRepository;
  maxEntries: number;

  constructor(repo: DiaryRepository, maxEntries: number = 50) {
    this.diaryRepository = repo;
    this.maxEntries = maxEntries;
  }

  public async getUserDiary(
    userId: number,
    start: Date,
    end: Date,
  ): Promise<UserEntryByDate> {
    return this.diaryRepository.getEntriesRange(userId, start, end);
  }

  public async deleteUserEntries(userId: number, id: number) {
    if (!this.diaryRepository.deleteUserEntry(userId, id)) {
      throw new NotFoundError({ message: "Failed to delete diary entry." });
    }
  }

  private checkIfValidMeal(meal: string) {
    if (!meals.includes(meal)) {
      throw new BadRequestError({ message: "meal must be a valid meal type." });
    }
  }

  private removeEmptyEntries(entries: string[]): string[] {
    return entries
      .map((meal) => meal.trim())
      .filter((meal) => meal.trim().length !== 0);
  }

  private maybeThrowIfEntriesExceedsMaxEntries(entries: string[]) {
    if (entries.length > this.maxEntries) {
      throw new BadRequestError({
        message: `Max entry for a meal is ${this.maxEntries}.`,
      });
    }
  }

  public async createEntry(
    userId: number,
    date: Date,
    meal: string,
    entries: string[],
  ): Promise<UserEntry> {
    this.checkIfValidMeal(meal);
    const removedEmptyEntries = this.removeEmptyEntries(entries);
    if (removedEmptyEntries.length == 0) {
      throw new BadRequestError({ message: "Please add at least one entry." });
    }
    this.maybeThrowIfEntriesExceedsMaxEntries(removedEmptyEntries);
    const userEntry = this.diaryRepository.addUserEntry(
      userId,
      date,
      meal,
      removedEmptyEntries,
    );
    if (!userEntry) {
      throw new DatabaseError({ message: "Failed to update entry" });
    }
    return userEntry;
  }

  public async updateEntry(
    userId: number,
    id: number,
    meal: string,
    entries: string[],
  ): Promise<UserEntry> {
    this.checkIfValidMeal(meal);
    const removedEmptyEntries = this.removeEmptyEntries(entries);
    this.maybeThrowIfEntriesExceedsMaxEntries(removedEmptyEntries);
    const userEntry = this.diaryRepository.updateUserEntry(
      userId,
      id,
      meal,
      removedEmptyEntries,
    );
    if (!userEntry) {
      throw new DatabaseError({ message: "Failed to update entry" });
    }
    return userEntry;
  }
}
