import { Type } from '@nestjs/common';
import { EventService } from './services/event.service';

export const services: Type<any>[] = [EventService];
