import { InjectLogger } from '@libs/logger/decorators';
import { LoggerService } from '@libs/logger';
import { Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@InjectLogger() private readonly logger: LoggerService) {}

  intercept(context, next) {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.http('Request success', 'LoggingInterceptor', {
            url: request.url,
            method: request.method,
          }),
        error: (error) =>
          this.logger.error(error.message, 'LoggingInterceptor', {
            url: request.url,
            method: request.method,
            error,
          }),
      }),
    );
  }
}
