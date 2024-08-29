import { Inject } from '@nestjs/common';
import { LOGGER } from '../logger.token';

export function InjectLogger() {
  return Inject(LOGGER);
}
