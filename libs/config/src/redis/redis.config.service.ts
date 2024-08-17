import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('redis.host') as string;
  }

  get port(): number {
    return this.configService.get<number>('redis.port') as number;
  }
}
