import test from "node:test";
import request from "supertest";
import { createApp } from "../src/appcreator";
import assert = require("node:assert");

test("get entries - no params set - bad request", async () => {
  const app = createApp();
  request(app)
    .get("/v1/diary/entries")
    .expect(400)
    .timeout(1000)
    .end((err, _res) => {
      if (err) throw err;
    });
});

test("get entries - invalid dates - bad request", async () => {
  const app = createApp();
  for (const { start, end } of [
    { start: "foo", end: "bar" },
    { start: 12345, end: 12334 },
  ]) {
    request(app)
      .get("/v1/diary/entries")
      .query({ start: start, end: end })
      .expect(400)
      .timeout(1000)
      .end((err, _res) => {
        if (err) throw err;
      });
  }
});

test("get entries - valid but no data", async () => {
  const app = createApp();
  request(app)
    .get("/v1/diary/entries")
    .query({ start: "2024-09-15", end: "2024-09-21" })
    .expect(200)
    .timeout(1000)
    .end((err, res) => {
      if (err) throw err;
      assert.equal(res.status, 200);
      assert.deepEqual(res.body.data, {});
    });
});

test("creating an entry - invalid meal type", async () => {
  const app = createApp();
  request(app)
    .post("/v1/diary/entries")
    .send({ date: "2024-09-15", meal: "bar", entries: ["banana", "eggs"] })
    .expect(400)
    .timeout(1000)
    .end((err, res) => {
      if (err) throw err;
      assert.equal(
        res.body.details[0].message,
        "meal is invalid. Meal must be one of these values: breakfast, lunch, dinner, snacks, drinks.",
      );
    });
});

test("creating an entry - entries is not an array", async () => {
  const app = createApp();
  request(app)
    .post("/v1/diary/entries")
    .send({ date: "2024-09-15", meal: "breakfast", entries: "bar" })
    .expect(400)
    .timeout(1000)
    .end((err, res) => {
      if (err) throw err;
      assert.equal(res.body.message, "Invalid data");
    });
});

test("creating an entry - was created successfully", async () => {
  const app = createApp();
  request(app)
    .post("/v1/diary/entries")
    .send({
      date: "2024-09-15",
      meal: "breakfast",
      entries: ["sausage", "eggs"],
    })
    .expect(201)
    .end((err, res) => {
      if (err) throw err;
      assert.deepEqual(res.body.data, {
        id: 1,
        userId: 1,
        date: "2024-09-15T00:00:00.000Z",
        entries: {
          breakfast: ["sausage", "eggs"],
        },
      });
    });
});

test("updating an entry was successful - removing eggs", async () => {
  const app = createApp();
  request(app)
    .post("/v1/diary/entries")
    .send({
      date: "2024-09-16",
      meal: "breakfast",
      entries: ["sausage", "eggs"],
    })
    .expect(201)
    .then((response) => {
      request(app)
        .patch(`/v1/diary/entries/${response.body.data.id}`)
        .send({ meal: "breakfast", entries: ["sausage"] })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          assert.deepEqual(res.body.data, {
            id: response.body.data.id,
            userId: 1,
            date: "2024-09-16T00:00:00.000Z",
            entries: {
              breakfast: ["sausage"],
            },
          });
        });
    });
});

test("updating an entry was successful - add item", async () => {
  const app = createApp();
  request(app)
    .post("/v1/diary/entries")
    .send({
      date: "2024-09-17",
      meal: "breakfast",
      entries: ["sausage", "eggs", "banana"],
    })
    .expect(201)
    .then((response) => {
      request(app)
        .patch(`/v1/diary/entries/${response.body.data.id}`)
        .send({ meal: "breakfast", entries: ["sausage", "eggs", "banana"] })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          assert.deepEqual(res.body.data, {
            id: response.body.data.id,
            userId: 1,
            date: "2024-09-17T00:00:00.000Z",
            entries: {
              breakfast: ["sausage", "eggs", "banana"],
            },
          });
        });
    });
});

test("deleting an entry was successful", async () => {
  const app = createApp();
  request(app)
    .post("/v1/diary/entries")
    .send({
      date: "2024-09-18",
      meal: "lunch",
      entries: ["pasta"],
    })
    .expect(201)
    .then((response) => {
      request(app)
        .delete(`/v1/diary/entries/${response.body.data.id}`)
        .expect(204)
        .end((err, res) => {
          if (err) throw err;
        });
    });
});

test("deleting an entry - wrong id passed - not found", async () => {
  const app = createApp();
  request(app)
    .delete("/v1/diary/entries/500000")
    .send()
    .expect(404)
    .end((err, _res) => {
      if (err) throw err;
    });
});
