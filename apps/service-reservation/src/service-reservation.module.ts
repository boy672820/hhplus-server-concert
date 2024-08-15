import { GlobalConfigModule } from '@libs/config';
import { KafkaConfigModule } from '@libs/config/kafka';
import { MockApiModule } from '@libs/mock-api';
import { Module } from '@nestjs/common';
import { consumers } from './interface';
import { usecases } from './application';
import { services } from './domain';
import { adapters } from './infrastructure';

@Module({
  imports: [GlobalConfigModule, KafkaConfigModule, MockApiModule],
  providers: [...usecases, ...services, ...adapters],
  controllers: [...consumers],
})
export class ServiceReservationModule {}