import { Injectable } from '@nestjs/common';
import { PointRepository } from './point.repository';
import { PointEntity } from './point.entity';

@Injectable()
export class PointService {
  constructor(private readonly repository: PointRepository) {}

  async find(userId: string): Promise<PointEntity> {
    const point = await this.repository.findByUserId(userId);

    if (point) {
      return point;
    }

    return PointEntity.of({
      userId,
      balance: '0',
      updatedDate: new Date(),
    });
  }

  async charge(userId: string, amount: string): Promise<PointEntity> {
    const point = await this.repository.findByUserId(userId);

    if (point) {
      point.balance = point.balance.add(amount);
      await this.repository.save(point);
      return point;
    }

    const newPoint = PointEntity.of({
      userId,
      balance: amount,
      updatedDate: new Date(),
    });
    await this.repository.save(newPoint);
    return newPoint;
  }
}
