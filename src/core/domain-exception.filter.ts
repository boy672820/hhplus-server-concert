import { DomainError, DomainErrorCode } from '@lib/errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    switch (error.code) {
      case DomainErrorCode.InvalidParameter:
        return response.status(400).json({
          code: 400,
          message: error.message,
        });
      case DomainErrorCode.NotFound:
        return response.status(404).json({
          code: 404,
          message: error.message,
        });
      case DomainErrorCode.Duplicated:
        return response.status(409).json({
          code: 409,
          message: error.message,
        });
      case DomainErrorCode.Conflict:
        return response.status(409).json({
          code: 409,
          message: error.message,
        });
      case DomainErrorCode.Unauthorized:
        return response.status(401).json({
          code: 401,
          message: error.message,
        });
      case DomainErrorCode.Forbidden:
        return response.status(403).json({
          code: 403,
          message: error.message,
        });
      case DomainErrorCode.LimitExceeded:
        return response.status(422).json({
          code: 422,
          message: error.message,
        });
      case DomainErrorCode.InternalError:
        return response.status(500).json({
          code: 500,
          message: error.message,
        });
      default:
        return response.status(500).json({
          code: 500,
          message: 'Internal server error',
        });
    }
  }
}
