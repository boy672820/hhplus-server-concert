import { LoggerService } from '@libs/logger';
import { InjectLogger } from '@libs/logger/decorators';
import { DomainError } from '@libs/common/errors';
import { Catch, ExceptionFilter } from '@nestjs/common';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(@InjectLogger() private readonly logger: LoggerService) {}

  catch(error: DomainError) {
    this.logger.error(
      `[DomainExceptionFilter] Error: ${error.code}: ${error.message}`,
    );

    return {
      code: error.code,
      message: error.message,
    };
  }
}
