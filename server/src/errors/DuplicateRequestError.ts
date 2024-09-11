import { ServiceError } from "./ServiceError";
import { StatusCodes } from "../constants/StatusCodes";
import { ServiceCommonInstanceError } from "../constants/ErrorCodes";
import { ServiceErrorCodeParams } from "./BadRequestError";

export default class DuplicateRequestError extends ServiceError {
  readonly errorCode: string;
  readonly statusCode: number = StatusCodes.CONFLICT;

  constructor({ message, errorCode }: ServiceErrorCodeParams) {
    super(message || ServiceCommonInstanceError.duplicateRequest.message);
    this.errorCode =
      errorCode || ServiceCommonInstanceError.duplicateRequest.errorCode;
    Object.setPrototypeOf(this, DuplicateRequestError.prototype);
  }
}
