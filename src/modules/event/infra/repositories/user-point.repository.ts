import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserPointRepository } from '../../domain/repositories';
import { UserPointEntity } from '../entities/user-point.entity';
import { UserPoint } from '../../domain/models';
import { UserPointMapper } from '../mappers/user-point.mapper';

@Injectable()
export class UserPointRepositoryImpl implements UserPointRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findById(userId: string) {
    const userPoint = await this.dataSource.manager.findOneBy(UserPointEntity, {
      userId,
    });
    return userPoint ? UserPointMapper.toModel(userPoint) : null;
  }

  async save(userPoint: UserPoint) {
    const userPointEntity = UserPointMapper.toEntity(userPoint);
    await this.dataSource.manager.save(userPointEntity);
  }
}
