import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EventRepository } from '../../domain/repositories';
import { EventEntity } from '../entities/event.entity';
import { EventMapper } from '../mappers/event.mapper';
import { Event } from '../../domain/models';

@Injectable()
export class EventRepositoryImpl implements EventRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll(): Promise<Event[]> {
    const entities = await this.dataSource.manager.find(EventEntity);
    return entities.map(EventMapper.toModel);
  }
}
