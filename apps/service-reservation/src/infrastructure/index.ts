import { Provider } from '@nestjs/common';
import { MockApiAdapter } from '../domain/adapters';
import { MockApiAdapterImpl } from './adapters/mock-api.adapter';
import { ReservationProducer } from '../domain/producers';
import { ReservationProducerImpl } from './producers/reservation.producer';

export const adapters: Provider[] = [
  {
    provide: MockApiAdapter,
    useClass: MockApiAdapterImpl,
  },
];

export const producers: Provider[] = [
  {
    provide: ReservationProducer,
    useClass: ReservationProducerImpl,
  },
];
