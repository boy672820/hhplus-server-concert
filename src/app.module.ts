import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { controllers, schedulers } from './interface';
import { repositories } from './infrastructure';
import { factories, services } from './domain';
import { commands, events, sagas, usecases } from './application';

@Module({
  imports: [CoreModule],
  controllers,
  providers: [
    ...schedulers,
    ...repositories,
    ...services,
    ...factories,
    ...usecases,
    ...commands,
    ...events,
    ...sagas,
  ],
})
export class AppModule {}
