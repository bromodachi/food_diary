import { UserEntry, UserEntryByDate } from "../model/UserDiary";

export interface DiaryService {
  /**
   * Returns all user entries for a user ID between the start and end, inclusive.
   * @param userId
   * @param start
   * @param end
   */
  getUserDiary(
    userId: number,
    start: Date,
    end: Date,
  ): Promise<UserEntryByDate>;

  /**
   * Deletes an entry for a user ID. May throw an exception if we failed to delete an entry.
   *
   * @param userId
   * @param id
   */
  deleteUserEntries(userId: number, id: number): void;

  /**
   * Creates a diary entry for a user ID. May throw an exception if the DB fails to update the entry or a duplicate was
   * detected.
   *
   * @param userId
   * @param date
   * @param meal
   * @param entries
   */
  createEntry(
    userId: number,
    date: Date,
    meal: string,
    entries: string[],
  ): Promise<UserEntry>;

  /**
   * Updates an entry for a diary entry id. May throw an exception if the DB fails to update the entry.
   *
   * @param userId
   * @param id
   * @param meal
   * @param entries
   */
  updateEntry(
    userId: number,
    id: number,
    meal: string,
    entries: string[],
  ): Promise<UserEntry>;
}
