import { Event } from '../../domain/models';
import { EventEntity } from '../entities/event.entity';

export class EventMapper {
  static toModel = (entity: EventEntity): Event =>
    Event.from({
      id: entity.id,
      title: entity.title,
      address: entity.address,
      startDate: entity.startDate,
      endDate: entity.endDate,
      createdDate: entity.createdDate,
      updatedDate: entity.updatedDate,
    });

  static toEntity = (model: Event): EventEntity =>
    EventEntity.of({
      id: model.id,
      title: model.title,
      address: model.address,
      startDate: model.startDate,
      endDate: model.endDate,
      createdDate: model.createdDate,
      updatedDate: model.updatedDate,
    });
}
