import { Type } from '@nestjs/common';
import { OutboxConsumer } from './consumers/outbox.consumer';
import { OutboxScheduler } from './schedulers/outbox.scheduler';

export const consumers: Type<any>[] = [OutboxConsumer];

export const schedulers: Type<any>[] = [OutboxScheduler];
