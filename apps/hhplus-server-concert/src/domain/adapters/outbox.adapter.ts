import { EventType } from '@libs/domain/types';
import { Transaction } from '../models';

export abstract class OutboxAdapter {
  abstract publish(
    type: EventType,
    payload: Record<string, any>,
  ): Promise<Transaction>;
}
