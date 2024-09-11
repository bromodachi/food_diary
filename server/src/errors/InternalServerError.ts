import { ServiceError } from "./ServiceError";
import { StatusCodes } from "../constants/StatusCodes";
import { ServiceErrorCodeParams } from "./BadRequestError";
import {
  ServiceErrorCode,
  ServiceCommonInstanceError,
} from "../constants/ErrorCodes";

export default class InternalServerError extends ServiceError {
  readonly errorCode: string;
  readonly statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor({ message, errorCode }: ServiceErrorCodeParams) {
    super(message || ServiceCommonInstanceError.internalServerError.message);
    this.errorCode =
      errorCode || ServiceCommonInstanceError.internalServerError.errorCode;
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
