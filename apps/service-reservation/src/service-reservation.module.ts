import { GlobalConfigModule } from '@libs/config';
import { KafkaConfigModule } from '@libs/config/kafka';
import { Module } from '@nestjs/common';
import { consumers } from './interface';

@Module({
  imports: [GlobalConfigModule, KafkaConfigModule],
  controllers: [...consumers],
})
export class ServiceReservationModule {}
