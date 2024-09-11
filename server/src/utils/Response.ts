import { Response } from "express";
import { StatusCodes } from "../constants/StatusCodes";
import { ErrorCodes } from "../constants/ErrorCodes";
import { ServiceError } from "../errors/ServiceError";

type ResponseInterface = {
  // on success, we'll have a data or just return an empty response
  data?: object;
  // error message
  message?: string;
  // error code
  errorCode?: string;
};

export class ResponseWrapper {
  public response: Response;

  constructor(response: Response) {
    this.response = response;
  }

  private constructResponse(
    res: ResponseInterface,
    statusCode: number,
  ): Response {
    return this.response.status(statusCode).send(res);
  }

  public ok(response: ResponseInterface): Response {
    return this.constructResponse(response, StatusCodes.OK);
  }

  public created(response: ResponseInterface): Response {
    return this.constructResponse(response, StatusCodes.CREATED);
  }

  public noContent(): Response {
    return this.response.status(StatusCodes.NO_CONTENT).send();
  }

  public handleStatusErrorCode(errorCode: ErrorCodes) {
    return this.constructResponse(
      {
        errorCode: errorCode.errorCode,
        message: errorCode.message,
      },
      errorCode.statusCode,
    );
  }

  public handleServiceError(serviceError: ServiceError) {
    return this.constructResponse(
      {
        errorCode: serviceError.errorCode,
        message: serviceError.message,
      },
      serviceError.statusCode,
    );
  }
}
