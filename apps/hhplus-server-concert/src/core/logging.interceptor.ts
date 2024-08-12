import { Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { tap } from 'rxjs';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context, next) {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.http('Request success', {
            url: request.url,
            method: request.method,
          }),
        error: (error) =>
          this.logger.error(error.message, {
            url: request.url,
            method: request.method,
            error,
          }),
      }),
    );
  }
}
