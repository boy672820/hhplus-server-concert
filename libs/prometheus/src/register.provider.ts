import { Provider } from '@nestjs/common';
import { collectDefaultMetrics, Registry } from 'prom-client';
import { REGISTER_PROVIDER } from './prometheus.token';

export const registerProvider: Provider = {
  provide: REGISTER_PROVIDER,
  useFactory: async () => {
    const register = new Registry();
    collectDefaultMetrics({ register });
    return register;
  },
};
