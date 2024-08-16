import { GlobalConfigModule } from '@libs/config';
import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import { MockApiModule } from '@libs/mock-api';
import { KafkaClientModule } from '@libs/kafka-client';
import { Module } from '@nestjs/common';
import { consumers } from './interface';
import { usecases } from './application';
import { services } from './domain';
import { adapters, producers } from './infrastructure';

@Module({
  imports: [
    GlobalConfigModule,
    KafkaConfigModule,
    MockApiModule,
    KafkaClientModule.registerAsync({
      imports: [KafkaConfigModule],
      useFactory: (kafkaConfig: KafkaConfigService) => ({
        brokers: [`${kafkaConfig.host}:${kafkaConfig.port}`],
      }),
      inject: [KafkaConfigService],
    }),
  ],
  providers: [...usecases, ...services, ...adapters, ...producers],
  controllers: [...consumers],
})
export class ServiceReservationModule {}
