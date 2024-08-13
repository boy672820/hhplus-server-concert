import { Provider } from '@nestjs/common';
import { MockApiAdapter } from '../domain/adapters';
import { MockApiAdapterImpl } from './adapters/mock-api.adapter';

export const adapters: Provider[] = [
  {
    provide: MockApiAdapter,
    useClass: MockApiAdapterImpl,
  },
];
