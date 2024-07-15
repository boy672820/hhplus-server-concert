import { ApplicationError, ApplicationErrorCode } from '@lib/errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(ApplicationError)
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(error: ApplicationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    switch (error.code) {
      case ApplicationErrorCode.InvalidParameter:
        return response.status(400).json({
          code: 400,
          message: error.message,
        });
      case ApplicationErrorCode.NotFound:
        return response.status(404).json({
          code: 404,
          message: error.message,
        });
      case ApplicationErrorCode.Duplicated:
        return response.status(409).json({
          code: 409,
          message: error.message,
        });
      case ApplicationErrorCode.Conflict:
        return response.status(409).json({
          code: 409,
          message: error.message,
        });
      case ApplicationErrorCode.Unauthorized:
        return response.status(401).json({
          code: 401,
          message: error.message,
        });
      case ApplicationErrorCode.Forbidden:
        return response.status(403).json({
          code: 403,
          message: error.message,
        });
      case ApplicationErrorCode.InternalError:
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
