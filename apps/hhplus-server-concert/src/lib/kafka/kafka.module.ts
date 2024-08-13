import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { clientProvider } from './client.provider';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [clientProvider],
    }),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
