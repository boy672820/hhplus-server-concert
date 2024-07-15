import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { PointRepository } from './point.repository';
import { PointService } from './point.service';

@Module({
  controllers: [PointController],
  providers: [PointRepository, PointService],
})
export class PointModule {}
