import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './kafka.configuration';
import { KafkaConfigService } from './kafka.config.service';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  providers: [KafkaConfigService],
  exports: [KafkaConfigService],
})
export class KafkaConfigModule {}
