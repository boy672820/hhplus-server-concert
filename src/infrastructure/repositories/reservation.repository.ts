import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReservationRepository } from '../../domain/repositories';
import { Reservation } from '../../domain/models';
import { ReservationMapper } from '../mappers/reservation.mapper';
import { ReservationEntity } from '../entities/reservation.entity';

@Injectable()
export class ReservationRepositoryImpl implements ReservationRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Reservation | null> {
    const entity = await this.dataSource.manager.findOneBy(ReservationEntity, {
      id,
    });
    return entity ? ReservationMapper.toModel(entity) : null;
  }

  async save(reservation: Reservation): Promise<void> {
    const entity = ReservationMapper.toEntity(reservation);
    await this.dataSource.manager.save(entity);
  }
}
