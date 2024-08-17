import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './app.configuration';
import { AppConfigService } from './app.config.service';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
