import { SeatEntity } from '@libs/database/entities';
import { SeatStatus } from '@libs/domain/types';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SeatRepository } from '../../domain/repositories';
import { Seat } from '../../domain/models';
import { SeatMapper } from '../mappers/seat.mapper';

@Injectable()
export class SeatRepositoryImpl implements SeatRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly seatMapper: SeatMapper,
  ) {}

  async findById(id: string): Promise<Seat | null> {
    const entity = await this.dataSource.manager.findOneBy(SeatEntity, { id });
    return entity ? this.seatMapper.toModel(entity) : null;
  }

  async findAvailables(scheduleId: string): Promise<Seat[]> {
    const entities = await this.dataSource.manager.find(SeatEntity, {
      loadEagerRelations: false,
      where: {
        scheduleId,
        status: SeatStatus.Pending,
      },
    });
    return entities.map(this.seatMapper.toModel);
  }

  async save(seat: Seat): Promise<void> {
    const entity = this.seatMapper.toEntity(seat);
    await this.dataSource.manager.save(entity);
  }
}
