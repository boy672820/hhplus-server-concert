import { GlobalConfigModule } from '@libs/config';
import { KafkaConfigModule } from '@libs/config/kafka';
import { Module } from '@nestjs/common';

@Module({
  imports: [GlobalConfigModule, KafkaConfigModule],
})
export class ServiceReservationModule {}
