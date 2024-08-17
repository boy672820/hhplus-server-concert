import { EventType } from '@libs/domain/types';

export class RetriedTransactionEvent {
  constructor(
    public readonly transactionId: string,
    public readonly eventType: EventType,
    public readonly payload: Record<string, any>,
  ) {}
}
