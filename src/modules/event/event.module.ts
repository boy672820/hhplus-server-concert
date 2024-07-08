import { Module } from '@nestjs/common';
import { controllers } from './presentation';

@Module({
  controllers,
})
export class EventModule {}
