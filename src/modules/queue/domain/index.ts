import { Type } from '@nestjs/common';
import { QueueService } from './services';

export const services: Type<any>[] = [QueueService];
