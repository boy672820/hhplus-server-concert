import { Seat } from '../../domain/models';
import { ScheduleEntity } from '../entities/schedule.entity';
import { SeatEntity } from '../entities/seat.entity';

export class SeatMapper {
  static toModel = (entity: SeatEntity): Seat =>
    Seat.from({
      id: entity.id,
      eventId: entity.eventId,
      scheduleId: entity.schedule.id,
      scheduleStartDate: entity.schedule.startDate,
      scheduleEndDate: entity.schedule.endDate,
      number: entity.number,
      status: entity.status,
      price: entity.price,
    });

  static toEntity = (model: Seat): SeatEntity => {
    const entity = new SeatEntity();
    entity.id = model.id;
    entity.eventId = model.eventId;
    entity.number = model.number;
    entity.status = model.status;
    entity.price = model.price;
    entity.schedule = new ScheduleEntity();
    entity.schedule.id = model.scheduleId;
    return entity;
  };
}
