import { DomainError } from '@libs/common/errors';
import { Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(error: DomainError) {
    this.logger.error(
      `[DomainExceptionFilter] Error: ${error.code}`,
      error.message,
    );

    return {
      code: error.code,
      message: error.message,
    };
  }
}
