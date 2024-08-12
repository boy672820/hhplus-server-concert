import { QueueEntity } from '@libs/database/entities';
import { LocalDateTime, QueueStatus } from '@libs/domain/types';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueueRepository } from '../../domain/repositories';
import { Queue } from '../../domain/models';
import { QueueMapper } from '../mappers/queue.mapper';

@Injectable()
export class QueueRepositoryImpl implements QueueRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async create(input: {
    userId: string;
    status: QueueStatus;
    expiresDate: LocalDateTime;
  }): Promise<Queue> {
    const entity = await this.dataSource.manager.create(QueueEntity, {
      userId: input.userId,
      status: input.status,
      expiresDate: input.expiresDate,
    });
    await this.dataSource.manager.save(entity);
    return QueueMapper.toModel(entity);
  }

  async findLastestByUserId(userId: string): Promise<Queue | null> {
    const entity = await this.dataSource.manager.findOne(QueueEntity, {
      where: { userId },
      order: { sequence: 'DESC' },
    });
    return entity ? QueueMapper.toModel(entity) : null;
  }

  async save(queue: Queue | Queue[]): Promise<void> {
    const entity = Array.isArray(queue)
      ? queue.map(QueueMapper.toEntity)
      : QueueMapper.toEntity(queue);
    await this.dataSource.manager.save(entity);
  }

  async getActiveCount(): Promise<number> {
    const result = await this.dataSource.manager.count(QueueEntity, {
      where: { status: QueueStatus.Active },
    });
    return result;
  }

  async findWaitingUsersByLimit(limit: number): Promise<Queue[]> {
    const entities = await this.dataSource.manager.find(QueueEntity, {
      where: { status: QueueStatus.Waiting },
      take: limit,
    });
    return entities.map(QueueMapper.toModel);
  }

  async findActiveUsers(): Promise<Queue[]> {
    const entities = await this.dataSource.manager.find(QueueEntity, {
      where: { status: QueueStatus.Active },
    });
    return entities.map(QueueMapper.toModel);
  }
}
