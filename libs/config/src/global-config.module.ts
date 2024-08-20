import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
  ],
})
export class GlobalConfigModule {
  static forRoot({
    envFilePath,
  }: {
    envFilePath: string | string[];
  }): DynamicModule {
    return {
      module: GlobalConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath,
          validate,
        }),
      ],
    };
  }
}
