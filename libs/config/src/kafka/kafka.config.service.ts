import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('kafka.host') as string;
  }

  get port(): number {
    return this.configService.get<number>('kafka.port') as number;
  }
}
