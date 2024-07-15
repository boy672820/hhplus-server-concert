export enum DomainErrorCode {
  InvalidParameter = 'INVALID_PARAMETER',
  NotFound = 'NOT_FOUND',
  Duplicated = 'DUPLICATED',
  Conflict = 'CONFLICT',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  LimitExceeded = 'LIMIT_EXCEEDED',
  InternalError = 'INTERNAL_ERROR',
}

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }

  static of(errorCode: DomainErrorCode, message: string) {
    return new DomainError(errorCode, message);
  }

  static invalidParameter(message: string) {
    return new DomainError(DomainErrorCode.InvalidParameter, message);
  }

  static notFound(message: string) {
    return new DomainError(DomainErrorCode.NotFound, message);
  }

  static duplicated(message: string) {
    return new DomainError(DomainErrorCode.Duplicated, message);
  }

  static conflict(message: string) {
    return new DomainError(DomainErrorCode.Conflict, message);
  }

  static unauthorized(message: string) {
    return new DomainError(DomainErrorCode.Unauthorized, message);
  }

  static forbidden(message: string) {
    return new DomainError(DomainErrorCode.Forbidden, message);
  }

  static limitExceeded(message: string) {
    return new DomainError(DomainErrorCode.LimitExceeded, message);
  }

  static internalError(message: string) {
    return new DomainError(DomainErrorCode.InternalError, message);
  }
}
