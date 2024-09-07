import { Injectable } from '@nestjs/common';
import { ScheduleEntity } from '@libs/database/entities';
import { SeatEntity } from '@libs/database/entities';
import { Seat } from '../../domain/models';
import { SeatFactory } from '../../domain/factories';

@Injectable()
export class SeatMapper {
  constructor(private readonly seatFactory: SeatFactory) {}

  toModel = (entity: SeatEntity): Seat =>
    this.seatFactory.reconstitute({
      id: entity.id,
      eventId: entity.eventId,
      scheduleId: entity.scheduleId,
      number: entity.number,
      status: entity.status,
      price: entity.price,
      version: entity.version,
    });

  toEntity(model: Seat): SeatEntity {
    const entity = new SeatEntity();
    entity.id = model.id;
    entity.eventId = model.eventId;
    entity.number = model.number;
    entity.status = model.status;
    entity.price = model.price;
    entity.version = model.version;
    entity.schedule = new ScheduleEntity();
    entity.schedule.id = model.scheduleId;
    return entity;
  }
}
