import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './database.configuration';
import { DatabaseConfigService } from './database.config.service';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
