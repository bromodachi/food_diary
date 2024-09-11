import { StatusCodes } from "./StatusCodes";

function formatCode(baseCode: number, size: number, number: number): string {
  let sb = "" + number;
  while (sb.length < size) {
    sb = "0" + sb;
  }
  return baseCode + sb;
}

const SERVICE_BASE_CODE = 911 as const;
const ERROR_CODE_LENGTH = 5 as const;

export interface ErrorCodes {
  errorCode: string;
  message: string;
  statusCode: number;
}

export enum ServiceErrorCode {
  INTERNAL_SERVER_ERROR = 0,
  BAD_REQUEST = 1,
  DUPLICATE_REQUEST = 2,
  NOT_FOUND = 3,
  DATABASE_ERROR = 4,
}

export class ServiceCommonInstanceError implements ErrorCodes {
  // Common errors
  public static readonly badRequest = new ServiceCommonInstanceError(
    formatCode(
      SERVICE_BASE_CODE,
      ERROR_CODE_LENGTH,
      ServiceErrorCode.BAD_REQUEST,
    ),
    "Bad request.",
    StatusCodes.BAD_REQUEST,
  );
  // Currently used mostly for creating an entry with the same date.
  public static readonly duplicateRequest = new ServiceCommonInstanceError(
    formatCode(
      SERVICE_BASE_CODE,
      ERROR_CODE_LENGTH,
      ServiceErrorCode.DUPLICATE_REQUEST,
    ),
    "Duplicate request detected.",
    StatusCodes.CONFLICT,
  );
  // any uncaught error, internal server exception should be thrown.
  public static readonly internalServerError = new ServiceCommonInstanceError(
    formatCode(
      SERVICE_BASE_CODE,
      ERROR_CODE_LENGTH,
      ServiceErrorCode.INTERNAL_SERVER_ERROR,
    ),
    "Internal server error.",
    StatusCodes.INTERNAL_SERVER_ERROR,
  );

  public static readonly notFound = new ServiceCommonInstanceError(
    formatCode(
      SERVICE_BASE_CODE,
      ERROR_CODE_LENGTH,
      ServiceErrorCode.NOT_FOUND,
    ),
    "Not found.",
    StatusCodes.NOT_FOUND,
  );

  public static readonly databaseError = new ServiceCommonInstanceError(
    formatCode(
      SERVICE_BASE_CODE,
      ERROR_CODE_LENGTH,
      ServiceErrorCode.DATABASE_ERROR,
    ),
    "Database error.",
    StatusCodes.INTERNAL_SERVER_ERROR,
  );

  private constructor(
    public readonly errorCode: string,
    public readonly message: string,
    public readonly statusCode: number,
  ) {}

  /**
   * Create a ServiceError that holds a message, the status code, and the error code.
   * If a msg is not passed, we'll use the default error message for a particular ServiceErrorCode.
   * @param errorCode
   * @param msg
   */
  static createErrorCode(
    errorCode: ServiceErrorCode,
    msg?: string,
  ): ErrorCodes {
    let baseErrorCode: ErrorCodes;
    switch (errorCode) {
      case ServiceErrorCode.BAD_REQUEST:
        baseErrorCode = ServiceCommonInstanceError.badRequest;
        break;
      case ServiceErrorCode.DUPLICATE_REQUEST:
        baseErrorCode = ServiceCommonInstanceError.duplicateRequest;
        break;
      case ServiceErrorCode.INTERNAL_SERVER_ERROR:
        baseErrorCode = ServiceCommonInstanceError.internalServerError;
        break;
      case ServiceErrorCode.NOT_FOUND:
        baseErrorCode = ServiceCommonInstanceError.notFound;
        break;
      case ServiceErrorCode.DATABASE_ERROR:
        baseErrorCode = ServiceCommonInstanceError.databaseError;
        break;
    }
    return {
      ...baseErrorCode,
      message: msg ?? baseErrorCode.message,
    };
  }
}
