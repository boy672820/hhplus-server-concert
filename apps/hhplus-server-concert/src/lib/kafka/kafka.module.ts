import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { clientProvider } from './client.provider';
import { KafkaClientImpl } from './kafka.client.impl';
import { KafkaClient } from './kafka.client';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [clientProvider],
    }),
  ],
  providers: [
    {
      provide: KafkaClient,
      useClass: KafkaClientImpl,
    },
  ],
  exports: [ClientsModule, KafkaClient],
})
export class KafkaModule {}
