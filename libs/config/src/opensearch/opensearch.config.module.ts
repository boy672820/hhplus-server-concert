import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './opensearch.configuration';
import { OpenSearchConfigService } from './opensearch.config.service';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  providers: [OpenSearchConfigService],
  exports: [OpenSearchConfigService],
})
export class OpenSearchConfigModule {}
