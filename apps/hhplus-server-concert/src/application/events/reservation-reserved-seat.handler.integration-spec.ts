import { KafkaConfigService } from '@libs/config/kafka';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { randomBytes } from 'crypto';
import { ReservationReservedSeatHandler } from './reservation-reserved-seat.handler';
import { TestCoreModule } from '../../core/test-core.module';
import { ReservationService } from '../../domain/services';
import { ReservationFactory } from '../../domain/factories/reservation.factory';
import {
  EventRepository,
  ReservationRepository,
  ScheduleRepository,
  SeatRepository,
} from '../../domain/repositories';
import { ReservationRepositoryImpl } from '../../infrastructure/repositories/reservation.repository';
import { SeatRepositoryImpl } from '../../infrastructure/repositories/seat.repository';
import { EventRepositoryImpl } from '../../infrastructure/repositories/event.repository';
import { ScheduleRepositoryImpl } from '../../infrastructure/repositories/schedule.repository';
import { ReservationProducer } from '../../domain/producers';
import { ReservationProducerImpl } from '../../infrastructure/producers/reservation.producer';
import { OutboxAdapter } from '../../domain/adapters';
import { OutboxAdapterImpl } from '../../infrastructure/adapters/outbox.adapter';
import { waitFor } from '../../lib/utils';
import { ulid } from 'ulid';

const waitForMessages = (buffer, { number = 1, delay = 50 } = {}) =>
  waitFor(() => (buffer.length >= number ? buffer : false), {
    delay,
    ignoreTimeout: true,
  });

const secureRandom = (length = 10) =>
  `${randomBytes(length).toString('hex')}-${process.pid}-${ulid()}`;

describe('ReservationReservedSeatHandler (Integration)', () => {
  let app: INestApplication;
  let reservationReservedSeatHandler: ReservationReservedSeatHandler;
  let kafka: Kafka;
  let testConsumer: Consumer;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestCoreModule],
      providers: [
        ReservationReservedSeatHandler,
        ReservationService,
        ReservationFactory,
        {
          provide: ReservationRepository,
          useClass: ReservationRepositoryImpl,
        },
        {
          provide: SeatRepository,
          useClass: SeatRepositoryImpl,
        },
        {
          provide: EventRepository,
          useClass: EventRepositoryImpl,
        },
        {
          provide: ScheduleRepository,
          useClass: ScheduleRepositoryImpl,
        },
        {
          provide: ReservationProducer,
          useClass: ReservationProducerImpl,
        },
        {
          provide: OutboxAdapter,
          useClass: OutboxAdapterImpl,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    reservationReservedSeatHandler = moduleRef.get(
      ReservationReservedSeatHandler,
    );

    await app.init();

    const kafkaConfigService = moduleRef.get(KafkaConfigService);

    kafka = new Kafka({
      brokers: [`${kafkaConfigService.host}:${kafkaConfigService.port}`],
    });
    testConsumer = kafka.consumer({
      groupId: 'test-group',
    });
    await testConsumer.connect();
    await testConsumer.subscribe({ topic: 'reservation.reserved.seat' });
  });

  afterEach(async () => {
    await app.close();
    await testConsumer.disconnect();
  });

  describe('좌석 예약 이벤트 발행', () => {
    it('Kafka 토픽에 이벤트가 전송된 후 Conssumer가 이를 처리합니다.', async () => {
      const reservationId = 'reservationId';
      const seatId = 'seatId';
      const transactionId = 'transactionId';

      const messagesConsumed: EachMessagePayload[] = [];
      testConsumer.run({
        eachMessage: async (event) => {
          messagesConsumed.push(event);
        },
      });

      const messages = Array.from({ length: 100 }).map(() => {
        const value = secureRandom();
        return { key: `key-${value}`, value: `value-${value}` };
      });

      await reservationReservedSeatHandler.handle({
        reservationId,
        seatId,
        transactionId,
      });

      await waitForMessages(messagesConsumed, { number: messages.length });

      expect(messagesConsumed[0]).toEqual(
        expect.objectContaining({
          topic: 'reservation.reserved.seat',
          partition: 0,
          message: expect.objectContaining({
            key: Buffer.from(messages[0].key),
            value: Buffer.from(messages[0].value),
            offset: '0',
          }),
        }),
      );

      expect(messagesConsumed[messagesConsumed.length - 1]).toEqual(
        expect.objectContaining({
          topic: 'reservation.reserved.seat',
          partition: 0,
          message: expect.objectContaining({
            key: Buffer.from(messages[messages.length - 1].key),
            value: Buffer.from(messages[messages.length - 1].value),
            offset: '99',
          }),
        }),
      );

      // 모든 메시지가 순서대로 처리되었는지 확인합니다.
      expect(messagesConsumed.map((m) => m.message.offset)).toEqual(
        messages.map((_, i) => `${i}`),
      );
    });
  });
});
