import { RedisModule } from '@libs/redis';
import { DynamicModule, Module } from '@nestjs/common';
import { OutboxModuleAsyncOptions } from './outbox.interface';
import { OUTBOX_SERVICE } from './outbox.token';
import { OutboxServiceImpl } from './outbox.service.impl';
import { OutboxRepository } from './outbox.repository';

@Module({})
export class OutboxModule {
  static registerAsync(options: OutboxModuleAsyncOptions): DynamicModule {
    const modules = options.imports || [];
    return {
      module: OutboxModule,
      imports: [
        ...modules,
        RedisModule.registerAsync({
          imports: modules,
          useFactory: (...args: any[]) => {
            const { redis } = options.useFactory(...args);
            return redis;
          },
          inject: options.inject,
        }),
      ],
      providers: [
        {
          provide: OUTBOX_SERVICE,
          useClass: OutboxServiceImpl,
        },
        OutboxRepository,
      ],
      exports: [OUTBOX_SERVICE],
    };
  }
}
