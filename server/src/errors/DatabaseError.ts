import { ServiceError } from "./ServiceError";
import { StatusCodes } from "../constants/StatusCodes";
import { ServiceErrorCodeParams } from "./BadRequestError";
import { ServiceCommonInstanceError } from "../constants/ErrorCodes";

export default class DatabaseError extends ServiceError {
  readonly errorCode: string;
  readonly statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor({ message, errorCode }: ServiceErrorCodeParams) {
    super(message || ServiceCommonInstanceError.databaseError.message);
    this.errorCode =
      errorCode || ServiceCommonInstanceError.databaseError.errorCode;
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
