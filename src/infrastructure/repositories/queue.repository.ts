import { LocalDateTime } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueueEntity } from '../entities/queue.entity';
import { QueueRepository } from '../../domain/repositories';
import { Queue } from '../../domain/models';
import { QueueMapper } from '../mappers/queue.mapper';

@Injectable()
export class QueueRepositoryImpl implements QueueRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async create(input: {
    userId: string;
    isAvailable: boolean;
    expiresDate: LocalDateTime;
  }): Promise<Queue> {
    const entity = await this.dataSource.manager.create(QueueEntity, {
      userId: input.userId,
      isAvailable: input.isAvailable,
      expiresDate: input.expiresDate,
    });
    await this.dataSource.manager.save(entity);
    return QueueMapper.toModel(entity);
  }

  async findByUserId(userId: string): Promise<Queue | null> {
    const entity = await this.dataSource.manager.findOne(QueueEntity, {
      where: { userId },
    });
    return entity ? QueueMapper.toModel(entity) : null;
  }

  async save(queue: Queue): Promise<void> {
    const entity = QueueMapper.toEntity(queue);
    await this.dataSource.manager.save(entity);
  }
}
