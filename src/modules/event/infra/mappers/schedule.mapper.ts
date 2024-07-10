import { Schedule } from '../../domain/models';
import { ScheduleEntity } from '../entities/schedule.entity';

export class ScheduleMapper {
  static toModel = (entity: ScheduleEntity): Schedule =>
    Schedule.from({
      id: entity.id,
      startDate: entity.startDate,
      endDate: entity.endDate,
    });

  static toEntity(model: Schedule): ScheduleEntity {
    const entity = new ScheduleEntity();
    entity.id = model.id;
    entity.startDate = model.startDate;
    entity.endDate = model.endDate;
    return entity;
  }
}
