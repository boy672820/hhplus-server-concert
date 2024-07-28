import { Inject } from '@nestjs/common';
import { REDIS_PROVIDER } from '../redis/redis.provider';

export function InjectRedis(): ParameterDecorator {
  return Inject(REDIS_PROVIDER);
}
