import { SeatStatus } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SeatRepository } from '../../domain/repositories';
import { Seat } from '../../domain/models';
import { SeatEntity } from '../entities/seat.entity';
import { SeatMapper } from '../mappers/seat.mapper';

@Injectable()
export class SeatRepositoryImpl implements SeatRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAvailables(scheduleId: string): Promise<Seat[]> {
    const entities = await this.dataSource.manager.findBy(SeatEntity, {
      schedule: { id: scheduleId },
      status: SeatStatus.Pending,
    });
    return entities.map(SeatMapper.toModel);
  }
}
