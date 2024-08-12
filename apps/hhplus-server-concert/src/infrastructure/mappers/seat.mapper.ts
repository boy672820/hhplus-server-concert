import { ScheduleEntity } from '@libs/database/entities';
import { SeatEntity } from '@libs/database/entities';
import { Seat } from '../../domain/models';

export class SeatMapper {
  static toModel = (entity: SeatEntity): Seat =>
    Seat.from({
      id: entity.id,
      eventId: entity.eventId,
      scheduleId: entity.scheduleId,
      number: entity.number,
      status: entity.status,
      price: entity.price,
      version: entity.version,
    });

  static toEntity = (model: Seat): SeatEntity => {
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
  };
}
