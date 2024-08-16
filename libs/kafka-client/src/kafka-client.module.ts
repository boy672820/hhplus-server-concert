import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { clientAsyncProvider } from './client.provider';
import { KafkaClientAsyncOptions } from './kafka-client.interface';

@Module({})
export class KafkaClientModule {
  static registerAsync(options: KafkaClientAsyncOptions): DynamicModule {
    return {
      module: KafkaClientModule,
      imports: [
        ClientsModule.registerAsync({
          clients: [clientAsyncProvider(options)],
        }),
      ],
      exports: [ClientsModule],
    };
  }
}
