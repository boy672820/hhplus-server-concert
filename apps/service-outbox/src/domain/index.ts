import { Type } from '@nestjs/common';
import { OutboxService } from './services';

export const services: Type<any>[] = [OutboxService];
