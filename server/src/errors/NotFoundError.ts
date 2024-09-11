import { ServiceError } from "./ServiceError";
import { StatusCodes } from "../constants/StatusCodes";
import { ServiceCommonInstanceError } from "../constants/ErrorCodes";
import { ServiceErrorCodeParams } from "./BadRequestError";

export default class NotFoundError extends ServiceError {
  readonly errorCode: string;
  readonly statusCode: number = StatusCodes.NOT_FOUND;

  constructor({ message, errorCode }: ServiceErrorCodeParams) {
    super(message || ServiceCommonInstanceError.notFound.message);
    this.errorCode = errorCode || ServiceCommonInstanceError.notFound.errorCode;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
