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

  async findById(id: string): Promise<Seat | null> {
    const entity = await this.dataSource.manager.findOneBy(SeatEntity, { id });
    return entity ? SeatMapper.toModel(entity) : null;
  }

  async findAvailables(scheduleId: string): Promise<Seat[]> {
    const entities = await this.dataSource.manager.find(SeatEntity, {
      loadEagerRelations: false,
      where: {
        scheduleId,
        status: SeatStatus.Pending,
      },
    });
    return entities.map(SeatMapper.toModel);
  }

  async save(seat: Seat): Promise<void> {
    const entity = SeatMapper.toEntity(seat);
    await this.dataSource.manager.save(entity);
  }
}
