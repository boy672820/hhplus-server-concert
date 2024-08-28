import { DynamicModule, Module } from '@nestjs/common';
import { OpensearchAsyncOptions } from './opensearch.interface';
import { createOpensearchClient } from './opensearch.provider';
import { OPENSEARCH, OPENSEARCH_CLIENT } from './opensearch.token';
import { providers } from './providers';

@Module({})
export class OpenSearchModule {
  static reigsterAsync(options: OpensearchAsyncOptions): DynamicModule {
    const imports = options.imports || [];
    const inject = options.inject || [];
    return {
      module: OpenSearchModule,
      imports,
      providers: [
        {
          provide: OPENSEARCH_CLIENT,
          useFactory: async (...args: any[]) => {
            const clientOptions = await options.useFactory(...args);
            const client = createOpensearchClient(clientOptions);
            return client;
          },
          inject,
        },
        ...providers,
      ],
      exports: [OPENSEARCH],
    };
  }
}
