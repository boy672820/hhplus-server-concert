import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { controllers, schedulers } from './interface';
import { mappers, producers, repositories } from './infrastructure';
import { factories, services } from './domain';
import { commands, events, sagas, usecases } from './application';

@Module({
  imports: [CoreModule],
  controllers,
  providers: [
    ...schedulers,
    ...repositories,
    ...mappers,
    ...services,
    ...factories,
    ...usecases,
    ...commands,
    ...events,
    ...sagas,
    ...producers,
  ],
})
export class AppModule {}
