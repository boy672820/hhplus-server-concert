import { ReservationEntity } from '@libs/database/entities';
import { ReservationDetailEntity } from '@libs/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReservationRepository } from '../../domain/repositories';
import { Reservation } from '../../domain/models';
import { ReservationMapper } from '../mappers/reservation.mapper';

@Injectable()
export class ReservationRepositoryImpl implements ReservationRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly mapper: ReservationMapper,
  ) {}

  async findById(id: string): Promise<Reservation | null> {
    const entity = await this.dataSource.manager.findOneBy(ReservationEntity, {
      id,
    });
    return entity ? this.mapper.toModel(entity) : null;
  }

  async save(reservation: Reservation): Promise<void> {
    const entity = ReservationMapper.toEntity(reservation);
    await this.dataSource.manager.save(entity);
  }

  async remove(reservation: Reservation): Promise<void> {
    const entity = ReservationMapper.toEntity(reservation);

    await this.dataSource.manager.transaction(async (manager) => {
      await manager.remove(entity);
      await manager.delete(ReservationDetailEntity, { id: entity.detail.id });
    });
  }
}
