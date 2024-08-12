import { ScheduleEntity } from '@libs/database/entities';
import { LocalDateTime } from '@libs/domain/types';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Schedule } from '../../domain/models';
import { ScheduleRepository } from '../../domain/repositories';
import { ScheduleMapper } from '../mappers/schedule.mapper';

@Injectable()
export class ScheduleRepositoryImpl implements ScheduleRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Schedule | null> {
    const schedule = await this.dataSource.manager.findOneBy(ScheduleEntity, {
      id,
    });
    return schedule ? ScheduleMapper.toModel(schedule) : null;
  }

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

  async findBetweenByEventId(
    eventId: string,
    between: { startDate: LocalDateTime; endDate: LocalDateTime },
  ): Promise<Schedule[]> {
    const entities = await this.dataSource
      .createQueryBuilder(ScheduleEntity, 'schedule')
      .select(['id', 'startDate', 'endDate'])
      .where('schedule.eventId = :eventId', { eventId })
      .andWhere('schedule.startDate >= :startDate')
      .andWhere('schedule.endDate <= :endDate')
      // .andWhere('schedule.status >= :status')
      .setParameters({
        eventId,
        startDate: between.startDate.toDate('Asia/Seoul'),
        endDate: between.endDate.toDate('Asia/Seoul'),
        // status: ScheduleStatus.Active,
      })
      .getRawMany();
    return entities.map(ScheduleMapper.toModel);
  }
}
