import { Module } from '@nestjs/common';
import { controllers } from './presentation';
import { repositories } from './infra';
import { services } from './domain';
import { useCases } from './application';

@Module({
  controllers,
  providers: [...repositories, ...services, ...useCases],
})
export class EventModule {}
