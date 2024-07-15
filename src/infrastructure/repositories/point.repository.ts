import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PointEntity } from '../entities/point.entity';
import { PointRepository } from '../../domain/repositories';
import { Point } from '../../domain/models';
import { PointMapper } from '../mappers/point.mapper';

@Injectable()
export class PointRepositoryImpl implements PointRepository {
  private repository: Repository<PointEntity>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(PointEntity);
  }

  async findByUserId(userId: string): Promise<Point | null> {
    const entity = await this.repository.findOneBy({ userId });
    return entity ? PointMapper.toModel(entity) : null;
  }

  async save(point: Point): Promise<void> {
    await this.repository.save(point);
  }
}
