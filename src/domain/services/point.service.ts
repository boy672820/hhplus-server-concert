import { Injectable } from '@nestjs/common';
import { DomainError } from '@lib/errors';
import Decimal from 'decimal.js';
import { PointRepository } from '../repositories';
import { Point } from '../models';

@Injectable()
export class PointService {
  constructor(private readonly pointRepository: PointRepository) {}

  async find(userId: string): Promise<Point> {
    const point = await this.pointRepository.findByUserId(userId);

    if (point) {
      return point;
    }

    return Point.create(userId);
  }

  async charge(userId: string, amount: string): Promise<Point> {
    const point = await this.pointRepository.findByUserId(userId);

    if (point) {
      point.balance = point.balance.add(amount);
      await this.pointRepository.save(point);
      return point;
    }

    const newPoint = Point.create(userId);

    await this.pointRepository.save(newPoint);

    return newPoint;
  }

  async pay({
    userId,
    amount,
  }: {
    userId: string;
    amount: Decimal;
  }): Promise<Point> {
    const userPoint = await this.pointRepository.findByUserId(userId);

    if (!userPoint) {
      throw DomainError.unauthorized('사용자를 찾을 수 없습니다.');
    }

    userPoint.pay(amount);

    await this.pointRepository.save(userPoint);

    return userPoint;
  }
}
