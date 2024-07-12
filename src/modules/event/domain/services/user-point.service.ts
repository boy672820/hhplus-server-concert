import { DomainError } from '@lib/errors';
import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { UserPointRepository } from '../repositories';

@Injectable()
export class UserPointService {
  constructor(private readonly userPointRepository: UserPointRepository) {}

  async pay({ userId, amount }: { userId: string; amount: Decimal }) {
    const userPoint = await this.userPointRepository.findById(userId);

    if (!userPoint) {
      throw DomainError.unauthorized('사용자를 찾을 수 없습니다.');
    }

    userPoint.pay(amount);

    await this.userPointRepository.save(userPoint);

    return userPoint;
  }
}
