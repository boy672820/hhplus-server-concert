import { Module } from '@nestjs/common';
import { controllers } from './presentation';
import { repositories } from './infra';
import { services } from './domain';
import { usecases } from './application';

@Module({
  controllers,
  providers: [...usecases, ...services, ...repositories],
})
export class QueueModule {}
