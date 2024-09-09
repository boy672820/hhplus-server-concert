import { DynamicModule, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerModuleAsyncOptions } from './logger.interface';
import { createLogger } from './createLogger';
import { providers } from './providers';
import { LOGGER } from './logger.token';
import { OpenSearchModule } from '../../opensearch/src';

@Module({})
export class LoggerModule {
  static forRootAsync(asyncOptions: LoggerModuleAsyncOptions): DynamicModule {
    const imports = asyncOptions.imports || [];
    const inject = asyncOptions.inject || [];
    return {
      global: asyncOptions.global || false,
      module: LoggerModule,
      imports: [
        WinstonModule.forRootAsync({
          imports,
          useFactory: (...args: any[]) => {
            const options = asyncOptions.useFactory(...args);
            const logger = createLogger(options);
            return logger;
          },
          inject,
        }),
        OpenSearchModule.reigsterAsync({
          imports,
          useFactory: async (...args: any[]) => {
            const options = asyncOptions.useFactory(...args);
            return { url: options.opensearchUrl };
          },
          inject,
        }),
      ],
      providers,
      exports: [LOGGER],
    };
  }
}
