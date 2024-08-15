import { Type } from '@nestjs/common';
import { OutboxConsumer } from './consumers/outbox.consumer';

export const consumers: Type<any>[] = [OutboxConsumer];
