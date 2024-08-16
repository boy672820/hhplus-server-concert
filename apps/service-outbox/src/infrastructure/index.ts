import { Provider, Type } from '@nestjs/common';
import { OutboxAdapter } from '../domain/adapters';
import { OutboxAdapterImpl } from './adapters/outbox.adapter';
import { TransactionMapper } from './mappers/transaction.mapper';
import { TransactionProducer } from '../domain/producers';
import { TransactionProducerImpl } from './producers/transaction.producer';

export const adapters: Provider[] = [
  {
    provide: OutboxAdapter,
    useClass: OutboxAdapterImpl,
  },
];

export const mappers: Type<any>[] = [TransactionMapper];

export const producers: Provider[] = [
  {
    provide: TransactionProducer,
    useClass: TransactionProducerImpl,
  },
];
