import { DatabaseType } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  get type(): DatabaseType {
    return this.configService.get<DatabaseType>(
      'database.type',
    ) as DatabaseType;
  }

  get host(): string {
    return this.configService.get<string>('database.host') as string;
  }

  get port(): number {
    return this.configService.get<number>('database.port') as number;
  }

  get username(): string {
    return this.configService.get<string>('database.username') as string;
  }

  get password(): string {
    return this.configService.get<string>('database.password') as string;
  }

  get database(): string {
    return this.configService.get<string>('database.name') as string;
  }
}
