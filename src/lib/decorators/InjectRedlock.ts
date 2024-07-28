import { Inject } from '@nestjs/common';
import { REDLOCK_PROVIDER } from '../redis/redis.provider';

export function InjectRedlock(): ParameterDecorator {
  return Inject(REDLOCK_PROVIDER);
}
