import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './redis.configuration';
import { RedisConfigService } from './redis.config.service';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisConfigModule {}
