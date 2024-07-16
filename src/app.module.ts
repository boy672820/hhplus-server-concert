import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { controllers, schedulers } from './interface';
import { repositories } from './infrastructure';
import { services } from './domain';
import { usecases } from './application';

@Module({
  imports: [CoreModule],
  controllers,
  providers: [...schedulers, ...repositories, ...services, ...usecases],
})
export class AppModule {}
