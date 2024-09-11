import {
  CreateUserEntries,
  DiaryEntry,
  diaryEntrySchema,
  UpdateUserEntries,
} from "@/model/UserEntries";
import { Failure, Result, Success } from "@/utils/Result";
import { OnError } from "@/model/OnError";
import { WebServiceErrorCode } from "@/constants/WebServiceErrorCode";

const defaultTimeout = 30 * 1000;
const commonHeaders = { "Content-Type": "application/json" };
const HOST = import.meta.env.VITE_SERVER_HOST;
const PORT = import.meta.env.VITE_SERVER_PORT;

const SERVER_API = `${HOST}:${PORT}`;

export const apiGetEntries = (start: string, end: string) =>
  fetch(
    `${SERVER_API}/v1/diary/entries?` +
      new URLSearchParams({ start: start, end: end }),
    { signal: AbortSignal.timeout(defaultTimeout) },
  ).then((response) => {
    if (!response.ok) {
      return Promise.reject();
    }
    return response.json();
  });

export const deleteEntries = (id: number): Promise<number> => {
  return fetch(`${SERVER_API}/v1/diary/entries/${id}`, {
    method: "DELETE",
    signal: AbortSignal.timeout(defaultTimeout),
  }).then((response) => {
    return response.status;
  });
};

// TODO: separate to its own method
export const updateEntries = (
  id: number,
  entry: UpdateUserEntries,
): Promise<Result<DiaryEntry, OnError>> =>
  fetch(`${SERVER_API}/v1/diary/entries/${id}`, {
    method: "PATCH",
    headers: commonHeaders,
    body: JSON.stringify(entry),
    signal: AbortSignal.timeout(defaultTimeout),
  }).then((response) => {
    return responseToResult(response);
  });

export const createEntries = (
  entry: CreateUserEntries,
): Promise<Result<DiaryEntry, OnError>> =>
  fetch(`${SERVER_API}/v1/diary/entries`, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify(entry),
    signal: AbortSignal.timeout(defaultTimeout),
  }).then((response) => {
    return responseToResult(response);
  });

function responseToResult(
  response: Response,
): Promise<Result<DiaryEntry, OnError>> {
  if (response.ok) {
    return response.json().then((json) => {
      const result = diaryEntrySchema.safeParse(json.data);
      // TODO: For requests like can't reach server, we should handle it.
      if (result.success) {
        return new Success(result.data);
      } else {
        return new Failure({
          msg: "Failed to read the data. Please wait a while and try again later.",
          statusCode: 502,
          errorCode: WebServiceErrorCode.FAILED_TO_PARSE,
        });
      }
    });
  } else {
    return response.json().then(
      (json) =>
        new Failure({
          msg: json.message,
          statusCode: response.status,
          errorCode: json?.errorCode || WebServiceErrorCode.UNKNOWN_ERROR,
        }),
    );
  }
}

// TODO:  We should be using the error codes but since it's really simple, let's just use the status code for now.
export function maybeReloadEntries(statusCode: number): boolean {
  // Not found or on conflict, we'll reload the entries.
  return statusCode === 404 || statusCode === 409;
}

export function isStatusCodeWithin400(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

export function isStatusCodeOkay(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}
