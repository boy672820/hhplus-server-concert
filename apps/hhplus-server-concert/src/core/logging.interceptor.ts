import { InjectLogger } from '@libs/logger/decorators';
import { LoggerService } from '@libs/logger';
import { Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@InjectLogger() private readonly logger: LoggerService) {}

  intercept(context, next) {
    const request = context.switchToHttp().getRequest();

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - start;

        this.logger.http('Request success', 'LoggingInterceptor', {
          url: request.url,
          method: request.method,
          status: response.statusCode,
          delay,
        });

        if (delay > 500) {
          this.logger.warn('Request is slow (>500ms)', 'LoggingInterceptor', {
            url: request.url,
            method: request.method,
            headers: request.headers,
            body: request.body,
            query: request.query,
            params: request.params,
            status: response.statusCode,
            delay,
          });
        }
      }),
      catchError((_error) => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - start;

        const error: Error | unknown =
          _error instanceof Error
            ? {
                name: _error.name,
                message: _error.message,
                stack: _error.stack,
              }
            : _error || {};

        this.logger.error('Request error', 'LoggingInterceptor', {
          url: request.url,
          method: request.method,
          headers: request.headers,
          body: request.body,
          query: request.query,
          params: request.params,
          status: response.statusCode,
          delay,
          error,
        });

        return throwError(() => error);
      }),
    );
  }
}
