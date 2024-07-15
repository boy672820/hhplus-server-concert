import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { DataSource, Repository } from 'typeorm';
import { PointEntity } from './point.entity';

@Injectable()
export class PointRepository {
  private repository: Repository<PointEntity>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(PointEntity);
  }

  async findByUserId(userId: string): Promise<PointEntity | null> {
    const point = await this.repository.findOneBy({ userId });
    return point;
  }

  async save(point: PointEntity): Promise<void> {
    await this.repository.save(point);
  }
}
