import express from "express";
import { ResponseWrapper } from "../utils/Response";
import { DiaryService } from "../services/DiaryService";
import { startOfDay } from "date-fns";
import { GetUserEntries, getUserEntriesSchema } from "../schemas/DiarySchemas";
import { asyncErrorHandler } from "../utils/AsyncErrorHandler";
import BadRequestError from "../errors/BadRequestError";

export class DiaryController {
  diaryService: DiaryService;

  // TODO: Don't use a static user id. Implement bearer token
  // that holds information on what's the user id.
  private static USER_ID: number = 1;

  constructor(service: DiaryService) {
    this.diaryService = service;
  }

  private static isValidDate(dateObject: any) {
    return new Date(dateObject).toString() !== "Invalid Date";
  }

  public getEntries = asyncErrorHandler(
    async (req: express.Request, res: express.Response) => {
      const userEntries: GetUserEntries = getUserEntriesSchema.parse(req.query);
      const responseWrapper = new ResponseWrapper(res);
      const start = startOfDay(userEntries.start);
      const end = startOfDay(userEntries.end);
      if (start >= end) {
        throw new BadRequestError({
          message: "Start should be less than the end date.",
        });
      }
      // TODO: Either keep or remove. Mostly if we want to limit the range a user can retrieve entries.
      // const difference = differenceInDays(end, start);
      // if (difference > 7) {
      //   return responseWrapper.badRequestWithMessage(
      //     "We currently only support up to 7 days",
      //   );
      // }
      const result = await this.diaryService.getUserDiary(
        DiaryController.USER_ID,
        start,
        end,
      );
      responseWrapper.ok({ data: result });
    },
  );

  public createEntry = asyncErrorHandler(
    async (req: express.Request, res: express.Response) => {
      const { date, meal, entries } = req.body;
      const dateObj = new Date(date);
      const responseWrapper = new ResponseWrapper(res);
      if (!DiaryController.isValidDate(dateObj)) {
        throw new BadRequestError({
          message: "Invalid date. Please specify a valid date.",
        });
      }
      const result = await this.diaryService.createEntry(
        DiaryController.USER_ID,
        dateObj,
        meal,
        entries,
      );
      return responseWrapper.created({ data: result });
    },
  );

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public delete = asyncErrorHandler(
    async (req: express.Request, res: express.Response) => {
      const { id } = req.params;
      const idAsNum = Number(id);
      const responseWrapper = new ResponseWrapper(res);
      if (Number.isNaN(idAsNum)) {
        throw new BadRequestError({ message: "Invalid id. Must be a number." });
      }
      await this.diaryService.deleteUserEntries(
        DiaryController.USER_ID,
        idAsNum,
      );
      return responseWrapper.noContent();
    },
  );

  public updateEntry = asyncErrorHandler(
    async (req: express.Request, res: express.Response) => {
      const { id } = req.params;
      const idAsNum = Number(id);
      const { meal, entries } = req.body;

      const responseWrapper = new ResponseWrapper(res);
      if (Number.isNaN(idAsNum)) {
        throw new BadRequestError({ message: "Invalid id. Must be a number." });
      }
      const result = await this.diaryService.updateEntry(
        DiaryController.USER_ID,
        idAsNum,
        meal,
        entries,
      );
      return responseWrapper.ok({ data: result });
    },
  );
}
