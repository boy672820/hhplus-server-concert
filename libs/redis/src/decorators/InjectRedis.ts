import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '../redis.token';

export function InjectRedis() {
  return Inject(REDIS_CLIENT);
}
