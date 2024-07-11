export enum ApplicationErrorCode {
  InvalidParameter = 'INVALID_PARAMETER',
  NotFound = 'NOT_FOUND',
  Duplicated = 'DUPLICATED',
  Conflict = 'CONFLICT',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  InternalError = 'INTERNAL_ERROR',
}

export class ApplicationError extends Error {
  constructor(
    public readonly code: ApplicationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ApplicationError';
  }

  static of(errorCode: ApplicationErrorCode, message: string) {
    return new ApplicationError(errorCode, message);
  }

  static invalidParameter(message: string) {
    return new ApplicationError(ApplicationErrorCode.InvalidParameter, message);
  }

  static notFound(message: string) {
    return new ApplicationError(ApplicationErrorCode.NotFound, message);
  }

  static duplicated(message: string) {
    return new ApplicationError(ApplicationErrorCode.Duplicated, message);
  }

  static conflict(message: string) {
    return new ApplicationError(ApplicationErrorCode.Conflict, message);
  }

  static unauthorized(message: string) {
    return new ApplicationError(ApplicationErrorCode.Unauthorized, message);
  }

  static forbidden(message: string) {
    return new ApplicationError(ApplicationErrorCode.Forbidden, message);
  }

  static internalError(message: string) {
    return new ApplicationError(ApplicationErrorCode.InternalError, message);
  }
}
