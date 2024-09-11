import { Response, Request, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "../constants/StatusCodes";
import logger from "../utils/Logger";
import {
  ServiceErrorCode,
  ServiceCommonInstanceError,
} from "../constants/ErrorCodes";

/**
 * Validates a request for a particular request type(query, params, body).
 * For any error, take the errors and show it to the user.
 * @param type
 * @param schema
 */
export function validateRequest(
  type: keyof Request,
  schema: z.ZodObject<any, any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        const errorJson: ErrorDto = {
          message: "Invalid data",
          details: errorMessages,
          errorCode: ServiceCommonInstanceError.badRequest.errorCode,
        };
        res.status(StatusCodes.BAD_REQUEST).json(errorJson);
      } else {
        logger.error(error, "Unknown error.");
        const errorJson: ErrorDto = {
          message: "Internal Server Error",
          errorCode: ServiceCommonInstanceError.internalServerError.errorCode,
        };
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorJson);
      }
    }
  };
}
