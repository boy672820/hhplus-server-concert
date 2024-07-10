import { LocalDateTime } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Schedule } from '../../domain/models';
import { ScheduleRepository } from '../../domain/repositories';
import { ScheduleEntity } from '../entities/schedule.entity';
import { ScheduleMapper } from '../mappers/schedule.mapper';

@Injectable()
export class ScheduleRepositoryImpl implements ScheduleRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findBetween({
    startDate,
    endDate,
  }: {
    startDate: LocalDateTime;
    endDate: LocalDateTime;
  }): Promise<Schedule[]> {
    const entities = await this.dataSource.manager.find(ScheduleEntity, {
      where: {
        startDate: MoreThanOrEqual(startDate),
        endDate: LessThanOrEqual(endDate),
      },
    });
    return entities.map(ScheduleMapper.toModel);
  }
}
