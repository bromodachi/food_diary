import { Request, Response } from "express";
import { ResponseWrapper } from "./Response";
import {
  ServiceCommonInstanceError,
  ServiceErrorCode,
} from "../constants/ErrorCodes";
export const notFoundHandler = (_req: Request, res: Response) => {
  new ResponseWrapper(res).handleStatusErrorCode(
    ServiceCommonInstanceError.createErrorCode(
      ServiceErrorCode.NOT_FOUND,
      "Invalid API call.",
    ),
  );
};
