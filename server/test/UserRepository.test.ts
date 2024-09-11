import test from "node:test";
import { InMemoryDiaryRepository } from "../src/repository/InMemoryDiaryRepository";
import assert = require("node:assert");
import { ServiceCommonInstanceError } from "../src/constants/ErrorCodes";

test("given two entries in two different weeks, we should only receive one entry", () => {
  // Arrange
  const userRepo = new InMemoryDiaryRepository();
  userRepo.addUserEntry(1, new Date(2024, 8, 13), "breakfast", [
    "eggs",
    "bacon",
  ]);
  userRepo.addUserEntry(1, new Date(2024, 8, 15), "dinner", [
    "rice",
    "chicken",
  ]);
  // Action
  const ranges = userRepo.getEntriesRange(
    1,
    new Date(2024, 8, 8),
    new Date(2024, 8, 14),
  );
  // Assert
  assert(ranges["2024-09-13"]);
  assert.strictEqual(ranges["2024-09-13"].id, 1);
  assert.deepEqual(ranges["2024-09-13"].entries.breakfast, ["eggs", "bacon"]);
  for (let i = 8; i <= 14; i++) {
    if (i !== 13) {
      assert(ranges[`2024-09/-${i}`] === undefined);
    }
  }
});

test("adding a duplicate date, should be an error", () => {
  // Arrange
  const userRepo = new InMemoryDiaryRepository();
  // Action - Part 1
  const result = userRepo.addUserEntry(1, new Date(2024, 8, 13), "breakfast", [
    "eggs",
    "bacon",
  ]);
  // Assert - Part 1
  assert(result);
  assert.deepEqual(result.entries.breakfast, ["eggs", "bacon"]);
  // Action/Assert - Part 2
  assert.throws(
    () =>
      userRepo.addUserEntry(1, new Date(2024, 8, 13), "dinner", [
        "rice",
        "chicken",
      ]),
    {
      name: "DuplicateRequestError",
      errorCode: ServiceCommonInstanceError.duplicateRequest.errorCode,
      message: "Duplicate date detected, you must update the entry instead!",
    },
  );
});

test("deleting an entry was successful", () => {
  // Arrange
  const userRepo = new InMemoryDiaryRepository();
  userRepo.addUserEntry(1, new Date(2024, 8, 13), "breakfast", [
    "eggs",
    "bacon",
  ]);
  userRepo.addUserEntry(1, new Date(2024, 8, 15), "dinner", [
    "rice",
    "chicken",
  ]);
  // Action
  let ranges = userRepo.getEntriesRange(
    1,
    new Date(2024, 8, 8),
    new Date(2024, 8, 14),
  );
  // Assert
  assert(ranges["2024-09-13"]);
  assert.equal(true, userRepo.deleteUserEntry(1, ranges["2024-09-13"].id));
  ranges = userRepo.getEntriesRange(
    1,
    new Date(2024, 8, 8),
    new Date(2024, 8, 14),
  );
  assert(ranges["2024-09-13"] === undefined);
});

test("updating an entry should be successful", () => {
  // Arrange
  const userRepo = new InMemoryDiaryRepository();
  userRepo.addUserEntry(1, new Date(2024, 8, 13), "breakfast", [
    "eggs",
    "bacon",
  ]);
  // change it to only eggs
  const result = userRepo.updateUserEntry(1, 1, "breakfast", ["eggs"]);
  assert(result);
  assert.deepEqual(result.entries.breakfast, ["eggs"]);
  // Action
  let ranges = userRepo.getEntriesRange(
    1,
    new Date(2024, 8, 8),
    new Date(2024, 8, 14),
  );
  // Assert
  assert(ranges["2024-09-13"]);
  assert.deepEqual(ranges["2024-09-13"].entries.breakfast, ["eggs"]);
});

test("updating an entry for a different meal, should be successful", () => {
  // Arrange
  const userRepo = new InMemoryDiaryRepository();
  userRepo.addUserEntry(1, new Date(2024, 8, 13), "breakfast", [
    "eggs",
    "bacon",
  ]);
  // change it to only eggs
  const result = userRepo.updateUserEntry(1, 1, "dinner", ["steak"]);
  assert(result);
  assert.deepEqual(result.entries.dinner, ["steak"]);
  // Action
  let ranges = userRepo.getEntriesRange(
    1,
    new Date(2024, 8, 8),
    new Date(2024, 8, 14),
  );
  // Assert
  assert(ranges["2024-09-13"]);
  assert.deepEqual(ranges["2024-09-13"].entries.breakfast, ["eggs", "bacon"]);
  assert.deepEqual(ranges["2024-09-13"].entries.dinner, ["steak"]);
});
