import { Provider } from '@nestjs/common';
import { OutboxAdapter } from '../domain/adapters';
import { OutboxAdapterImpl } from './adapters/outbox.adapter';

export const adapters: Provider[] = [
  {
    provide: OutboxAdapter,
    useClass: OutboxAdapterImpl,
  },
];
