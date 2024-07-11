import { Type } from '@nestjs/common';
import { QueueController } from './controllers/queue.controller';

export const controllers: Type<any>[] = [QueueController];
