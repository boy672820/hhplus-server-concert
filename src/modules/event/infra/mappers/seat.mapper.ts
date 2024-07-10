import { Seat } from '../../domain/models';
import { SeatEntity } from '../entities/seat.entity';

export class SeatMapper {
  static toModel = (entity: SeatEntity): Seat =>
    Seat.from({
      id: entity.id,
      eventId: entity.eventId,
      number: entity.number,
      status: entity.status,
    });

  static toEntity = (model: Seat): SeatEntity => {
    const entity = new SeatEntity();
    entity.id = model.id;
    entity.eventId = model.eventId;
    entity.number = model.number;
    entity.status = model.status;
    return entity;
  };
}
