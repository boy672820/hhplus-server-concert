import { EventEntity } from '@libs/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EventRepository } from '../../domain/repositories';
import { EventMapper } from '../mappers/event.mapper';
import { Event } from '../../domain/models';

@Injectable()
export class EventRepositoryImpl implements EventRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Event | null> {
    const event = await this.dataSource.manager.findOneBy(EventEntity, { id });
    return event ? EventMapper.toModel(event) : null;
  }

  async findAll(): Promise<Event[]> {
    const entities = await this.dataSource.manager.find(EventEntity);
    return entities.map(EventMapper.toModel);
  }
}
