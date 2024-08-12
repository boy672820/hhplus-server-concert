import { Injectable } from '@nestjs/common';
import { Point } from '../../domain/models';
import { PointService } from '../../domain/services';

@Injectable()
export class RechargePointUseCase {
  constructor(private readonly pointService: PointService) {}

  async execute({
    userId,
    amount,
  }: {
    userId: string;
    amount: string;
  }): Promise<Point> {
    const point = await this.pointService.charge(userId, amount);
    return point;
  }
}
