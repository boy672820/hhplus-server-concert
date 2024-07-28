import { LocalDateTime } from '@lib/types';
import { RedlockService } from '@lib/redis';
import { Injectable } from '@nestjs/common';
import { DomainError } from '@lib/errors';
import Decimal from 'decimal.js';
import { PointRepository } from '../repositories';
import { Point } from '../models';

@Injectable()
export class PointService {
  constructor(
    private readonly pointRepository: PointRepository,
    private readonly redlockService: RedlockService,
  ) {}

  async find(userId: string): Promise<Point> {
    const point = await this.pointRepository.findByUserId(userId);

    if (point) {
      return point;
    }

    return Point.create(userId);
  }

  async charge(userId: string, amount: string): Promise<Point> {
    const lock = await this.redlockService.acquire(['user_point', userId]);

    try {
      const point = await this.pointRepository.findByUserId(userId);

      if (point) {
        point.balance = point.balance.add(amount);
        await this.pointRepository.save(point);
        return point;
      }

      const newPoint = Point.from({
        userId,
        balance: new Decimal(amount),
        updatedDate: LocalDateTime.now(),
      });

      await this.pointRepository.save(newPoint);

      return newPoint;
    } finally {
      await this.redlockService.release(lock);
    }
  }

  async pay({
    userId,
    amount,
  }: {
    userId: string;
    amount: Decimal;
  }): Promise<Point> {
    const lock = await this.redlockService.acquire(['user_point', userId]);

    try {
      const userPoint = await this.pointRepository.findByUserId(userId);

      if (!userPoint) {
        throw DomainError.limitExceeded('잔액이 부족합니다.');
      }

      userPoint.pay(amount);

      await this.pointRepository.save(userPoint);

      return userPoint;
    } finally {
      await this.redlockService.release(lock);
    }
  }
}
