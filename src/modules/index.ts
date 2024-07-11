import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { PointModule } from './point/point.module';
import { QueueModule } from './queue/queue.module';

export const modules: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [EventModule, PointModule, QueueModule];
