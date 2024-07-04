import { Type } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { ScheduleController } from './controllers/schedule.controller';

export const controllers: Type<any>[] = [EventController, ScheduleController];
