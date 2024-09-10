import { DynamicModule, Module } from '@nestjs/common';
import { registerProvider } from './register.provider';
import { PrometheusController } from './prometheus.controller';

@Module({})
export class PrometheusModule {
  static register(): DynamicModule {
    return {
      module: PrometheusModule,
      controllers: [PrometheusController],
      providers: [registerProvider],
    };
  }
}
