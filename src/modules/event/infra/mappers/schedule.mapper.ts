import { Schedule } from '../../domain/models';
import { ScheduleEntity } from '../entities/schedule.entity';

export class ScheduleMapper {
  static toModel = (entity: ScheduleEntity): Schedule =>
    Schedule.from({
      id: entity.id,
      startDate: entity.startDate,
      endDate: entity.endDate,
    });
}
