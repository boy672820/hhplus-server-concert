import { Provider } from '@nestjs/common';
import { LoggerServiceImpl } from './logger.service.impl';
import { LOGGER } from '../logger.token';

export const providers: Provider[] = [
  {
    provide: LOGGER,
    useClass: LoggerServiceImpl,
  },
];
