import { ServiceError } from "./ServiceError";
import { ServiceCommonInstanceError } from "../constants/ErrorCodes";
import { StatusCodes } from "../constants/StatusCodes";

export type ServiceErrorCodeParams = {
  errorCode?: string;
  message?: string;
};

export default class BadRequestError extends ServiceError {
  readonly errorCode: string;
  readonly statusCode: number = StatusCodes.BAD_REQUEST;

  constructor({ message, errorCode }: ServiceErrorCodeParams) {
    super(message || ServiceCommonInstanceError.badRequest.message);
    this.errorCode =
      errorCode || ServiceCommonInstanceError.badRequest.errorCode;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
