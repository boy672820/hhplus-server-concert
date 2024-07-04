import { Module } from '@nestjs/common';
import { PointController } from './point.controller';

@Module({
  controllers: [PointController],
})
export class PointModule {}
