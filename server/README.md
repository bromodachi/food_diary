# Food Diary Server

A really simple server implementation of a food diary. Runs on Node.js but uses the express framework
to avoid reinventing the wheel to handle requests and responses.

This application simply records what a user has ate for a meal(breakfast, lunch, dinner, snacks, drinks).
A user can either create an entry for a day, update an entry, delete entries for an entire day, or list all entries for a date range.
Everything is done in in-memory. I was about to use sql-lite to emulate a running on postgres or mysql but decided to simplify it even more with just using
a simple data structure: an array.

For retrieving entries, we sort the array then use binary search to search for specific entries(mostly for dates).

The server timezone is set to UTC.

## Configuration

If you want to change the PORT of the server, you can do by changing SERVER_PORT to whatever port you want. However,
if you do update this, please update the port of `VITE_SERVER_PORT` to 3000.
Note: CORS will be enabled to all origin if we're in the dev environment. On production, we shouldn't turn this on.
Also, ideally, the prod env should not be using the in-memory repository.

## Scripts Available

### Tests

We have around 20 test cases. Most are unit tests but we do have integration tests as well. Usually, I would split them
but added all of them in one command: `npm run test`

### Running the application

To run the application, run: `npm run dev`

## API

We've attached postman collections to help the user call each API(in root, import `Food Diary.postman_collection.json` to postman) but we'll also go through each API with curl commands.
The frontend application calls these APIs.

### Validations

Each API validates the request via `zod`. If zod can't parse the request, we'll return a 400, bad request.

### Getting entries

You must pass the start and end params. These must be values that a string value a date object can take in.

Example:

| query param name | example value |
| ---------------- | ------------- |
| start            | `2024-09-15`  |
| end              | `2024-09-21`  |

Dates must be in the format of: YYYY-MM-DD

You can retrieve all entries a user has made with the following curl command:

```shell
curl 'http://localhost:3000/v1/diary/entries?start=2024-09-15&end=2024-09-21'
```

Example result:

```json
{
  "data": {
    "2024-09-17": {
      "id": 4,
      "userId": 1,
      "date": "2024-09-17T00:00:00.000Z",
      "entries": {
        "lunch": ["steak", "rice"],
        "dinner": ["rice", "broccoli"]
      }
    },
    "2024-09-18": {
      "id": 5,
      "userId": 1,
      "date": "2024-09-18T00:00:00.000Z",
      "entries": {
        "breakfast": ["eggs", "tomato"],
        "snacks": ["cookies", "shake", "orange"]
      }
    },
    "2024-09-19": {
      "id": 6,
      "userId": 1,
      "date": "2024-09-19T00:00:00.000Z",
      "entries": {
        "drinks": ["coffee"]
      }
    },
    "2024-09-20": {
      "id": 3,
      "userId": 1,
      "date": "2024-09-20T00:00:00.000Z",
      "entries": {
        "drinks": ["coffee"],
        "lunch": ["chipotle", "wrap"]
      }
    },
    "2024-09-21": {
      "id": 2,
      "userId": 1,
      "date": "2024-09-21T00:00:00.000Z",
      "entries": {
        "drinks": ["tea"]
      }
    }
  }
}
```

### Creating an entry

To create an entry, you must send a POST with the data. "date", "meal", "entries".

| body param name | type                                       | example      |
| --------------- | ------------------------------------------ | ------------ |
| date            | string. Must be in the format `YYYY-MM-DD` | `2024-10-24` |
| meal            | string                                     | `breakfast`  |
| entries         | string[]                                   | `["eggs"]`   |

All available meal type:

- breakfast
- lunch
- dinner
- snacks
- drinks

```shell
curl 'http://localhost:3000/v1/diary/entries' \
--header 'Content-Type: application/json' \
--data '{
    "date": "2024-10-23",
    "meal": "lunch",
    "entries": ["sausage", "eggs"]
}'
```

Example result:

```json
{
  "data": {
    "id": 7,
    "userId": 1,
    "date": "2024-10-23T00:00:00.000Z",
    "entries": {
      "lunch": ["sausage", "eggs"]
    }
  }
}
```

### Updating an entry

`http://localhost:3000/v1/diary/entries/:id`

Once you've created an id or know the ID of a previous entry, you can update the entry.
Currently, we only accept patch requests(only update a portion of the entries for a meal).
However, any entry for that meal will be replaced by the entries you passed.

| **body param name** | **type**   | **example value** |
| ------------------- | ---------- | ----------------- |
| meal                | string     | `lunch`           |
| entries             | string\[\] | `["eggs"]`        |

All available meal type:

- breakfast
- lunch
- dinner
- snacks
- drinks

```shell
curl --request PATCH 'http://localhost:3000/v1/diary/entries/12' \
--header 'Content-Type: application/json' \
--data '{
    "meal": "dinner",
    "entries": ["steak"]
}'
```

Example result:

```json
{
  "data": {
    "id": 8,
    "userId": 1,
    "date": "2024-10-15T00:00:00.000Z",
    "entries": {
      "lunch": ["sausage", "eggs"],
      "dinner": ["steak"]
    }
  }
}
```

### Deleting an entry

`http://localhost:3000/v1/diary/entries/:id`

If you want to delete all entries for a particular day, you must pass the id of that day.

```shell
curl --request DELETE 'http://localhost:3000/v1/diary/entries/12'
```

The result will be empty but the status code will be 204.

### Other notes

While it's not possible to create a diary entry with no entries, it is possible to update a diary entry to have no entries.
The user will have to call the delete API to remove it.
