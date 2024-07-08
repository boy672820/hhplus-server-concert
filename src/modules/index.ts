import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { PointModule } from './point/point.module';

export const modules: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [EventModule, PointModule];
