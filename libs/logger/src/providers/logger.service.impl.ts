import { LocalDateTime } from '@libs/domain/types';
import { OpenSearchService } from '@libs/opensearch';
import { InjectOpenSearch } from '@libs/opensearch/decorators';
import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerServiceImpl implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectOpenSearch() private readonly opensearchService: OpenSearchService,
  ) {}

  error(
    message: string,
    serviceName?: string,
    errorOrMeta?: Error | Record<string, any>,
  ): void {
    let data: Error | Record<string, any>;

    if (errorOrMeta instanceof Error) {
      data = {
        name: errorOrMeta.name,
        message: errorOrMeta.message,
        stack: errorOrMeta.stack,
      };
    } else {
      data = errorOrMeta || {};
    }

    this.logger.error(message, { ...data, serviceName });
    this.opensearchService.index('log-errors', {
      message,
      data,
      serviceName,
      timestamp: LocalDateTime.now().toString(),
    });
  }

  warn(
    message: string,
    serviceName?: string,
    data?: Record<string, any>,
  ): void {
    this.logger.warn(message, { data, serviceName });
    this.opensearchService.index('log-warnings', {
      message,
      data,
      serviceName,
      timestamp: LocalDateTime.now().toString(),
    });
  }

  http(
    message: string,
    serviceName?: string,
    data?: Record<string, any>,
  ): void {
    this.logger.http(message, { data, serviceName });
    this.opensearchService.index('log-http', {
      message,
      data,
      serviceName,
      timestamp: LocalDateTime.now().toString(),
    });
  }

  info(
    message: string,
    serviceName?: string,
    data?: Record<string, any>,
  ): void {
    this.logger.info(message, { data, serviceName });
    this.opensearchService.index('log-info', {
      message,
      data,
      serviceName,
      timestamp: LocalDateTime.now().toString(),
    });
  }

  debug(message: string, serviceName?: string): void {
    this.logger.debug(message, { serviceName });
  }
}
