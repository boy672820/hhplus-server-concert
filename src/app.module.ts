import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { modules } from './modules';

@Module({
  imports: [CoreModule, ...modules],
})
export class AppModule {}
