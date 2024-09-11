export abstract class ServiceError extends Error implements ErrorDto {
  abstract readonly errorCode: string;
  abstract readonly statusCode: number;

  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}
