import { UserEntry, UserEntryByDate } from "../model/UserDiary";

export interface DiaryRepository {
  /**
   * Add a diary entry for a user. May throw an exception if a duplicate date was detected as
   * the user should be updating the entry instead.
   *
   * @param userId
   * @param date
   * @param meal
   * @param entries
   */
  addUserEntry(
    userId: number,
    date: Date,
    meal: string,
    entries: string[],
  ): UserEntry | undefined;

  /**
   * Given a diary entry id for a user, update the entry with the entries for a particular meal.
   * Will return the updated entry with the new meal entry. If failed to update, undefined will be returned.
   *
   * @param userId
   * @param id
   * @param meal
   * @param entries
   */
  updateUserEntry(
    userId: number,
    id: number,
    meal: string,
    entries: string[],
  ): UserEntry | undefined;

  /**
   * Retrieves diary entries for a particular range. Inclusive
   * @param userId
   * @param from
   * @param to
   */
  getEntriesRange(userId: number, from: Date, to: Date): UserEntryByDate;

  /**
   * Given a diary entry id, remove the for the user. Returns true if was deleted successfully. False, otherwise.
   * @param userId
   * @param id
   */
  deleteUserEntry(userId: number, id: number): boolean;
}
