import { EventType } from '@libs/domain/types';

export abstract class TransactionProducer {
  abstract emitTransaction(
    eventType: EventType,
    payload: Record<string, any>,
  ): void;
}
