import { NextFunction, Request, Response } from "express";
import logger from "../utils/Logger";
import { ResponseWrapper } from "../utils/Response";
import { ServiceError } from "../errors/ServiceError";
import {
  ServiceErrorCode,
  ServiceCommonInstanceError,
} from "../constants/ErrorCodes";

/**
 * Catches all exception thrown. If an unknown error, we'll log it as an "error".
 * For a ServiceError, if the statusCode is equal to or above 500, we'll also log it as an error.
 * Anything between 300-499, it'll be a warn instead.
 *
 * @param err
 * @param _req
 * @param res
 * @param _next
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ServiceError) {
    if (err.statusCode >= 500) {
      logger.error(err);
    } else {
      logger.warn(err);
    }
    return new ResponseWrapper(res).handleServiceError(err);
  }
  logger.error(err, "Unknown error");
  return new ResponseWrapper(res).handleStatusErrorCode(
    ServiceCommonInstanceError.createErrorCode(
      ServiceErrorCode.INTERNAL_SERVER_ERROR,
      "Unknown Error.",
    ),
  );
};
