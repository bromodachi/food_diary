import test from "node:test";
import { InMemoryDiaryRepository } from "../src/repository/InMemoryDiaryRepository";
import { DiaryServiceImpl } from "../src/services/DiaryServiceImpl";
import assert = require("node:assert");
import { UserEntry } from "../src/model/UserDiary";

test("Adding an empty entry - should be a bad request", async () => {
  const userRepo = new InMemoryDiaryRepository();
  const userService = new DiaryServiceImpl(userRepo);
  await assert.rejects(
    async () => {
      await userService
        .createEntry(1, new Date(2024, 8, 13), "breakfast", [])
        .catch((e) => Promise.reject(e));
    },
    (err: Error) => {
      assert.strictEqual(err.name, "BadRequestError");
      assert.strictEqual(err.message, "Please add at least one entry.");
      return true;
    },
  );
});

test("Deleting an unknown entry - should be a not found error", async () => {
  const userRepo = new InMemoryDiaryRepository();
  const userService = new DiaryServiceImpl(userRepo);
  await assert.rejects(
    async () => {
      await userService
        .deleteUserEntries(1, 500)
        .catch((e) => Promise.reject(e));
    },
    (err: Error) => {
      assert.strictEqual(err.name, "NotFoundError");
      assert.strictEqual(err.message, "Failed to delete diary entry.");
      return true;
    },
  );
});

test("creating entries - max entries exceeds 50", async () => {
  const userRepo = new InMemoryDiaryRepository();
  const userService = new DiaryServiceImpl(userRepo, 50);
  await assert.rejects(
    async () => {
      await userService
        .createEntry(
          1,
          new Date(2024, 8, 13),
          "breakfast",
          [...Array(51)].map((_, i) => "" + i),
        )
        .catch((e) => Promise.reject(e));
    },
    (err: Error) => {
      assert.strictEqual(err.name, "BadRequestError");
      assert.strictEqual(err.message, "Max entry for a meal is 50.");
      return true;
    },
  );
});

test("update entries - max entries exceeds 50", async () => {
  const userRepo = new InMemoryDiaryRepository();
  const userService = new DiaryServiceImpl(userRepo, 50);
  const fakeEntries = [...Array(49)].map((_, i) => "" + i);
  await assert.rejects(
    async () => {
      await userService
        .createEntry(1, new Date(2024, 8, 13), "breakfast", fakeEntries)
        .then((userEntry: UserEntry) =>
          userService.updateEntry(userEntry.userId, userEntry.id, "breakfast", [
            ...fakeEntries,
            ...["bar", "foo"],
          ]),
        )
        .catch((e) => Promise.reject(e));
    },
    (err: Error) => {
      assert.strictEqual(err.name, "BadRequestError");
      assert.strictEqual(err.message, "Max entry for a meal is 50.");
      return true;
    },
  );
});
