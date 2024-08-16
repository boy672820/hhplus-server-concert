import { Type } from '@nestjs/common';
import { OutboxService } from './services';
import { TransactionFactory } from './factories';

export const services: Type<any>[] = [OutboxService];

export const factories: Type<any>[] = [TransactionFactory];
