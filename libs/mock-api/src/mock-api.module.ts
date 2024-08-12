import { Module } from '@nestjs/common';
import { MockApiService } from './mock-api.service';

@Module({
  providers: [MockApiService],
  exports: [MockApiService],
})
export class MockApiModule {}
