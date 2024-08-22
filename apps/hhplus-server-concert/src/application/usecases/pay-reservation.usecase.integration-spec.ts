import {
  ActiveQueueUserSeeder,
  seedPoint,
  seedReservation,
} from '../../lib/fixtures';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PayReservationUseCase } from './pay-reservation.usecase';
import { TestCoreModule } from '../../core/test-core.module';
import {
  PaymentService,
  PointService,
  QueueService,
  ReservationService,
  SeatService,
} from '../../domain/services';
import { PointEntity, ReservationEntity } from '@libs/database/entities';
import {
  EventRepository,
  PaymentRepository,
  PointRepository,
  QueueRepository,
  ReservationRepository,
  ScheduleRepository,
  SeatRepository,
} from '../../domain/repositories';
import { ReservationRepositoryImpl } from '../../infrastructure/repositories/reservation.repository';
import { EventRepositoryImpl } from '../../infrastructure/repositories/event.repository';
import { SeatRepositoryImpl } from '../../infrastructure/repositories/seat.repository';
import { PointRepositoryImpl } from '../../infrastructure/repositories/point.repository';
import { PaymentRepositoryImpl } from '../../infrastructure/repositories/payment.repository';
import { QueueRepositoryImpl } from '../../infrastructure/repositories/queue.repository';
import { ReservationProducerImpl } from '../../infrastructure/producers/reservation.producer';
import { OutboxAdapterImpl } from '../../infrastructure/adapters/outbox.adapter';
import { ReservationFactory } from '../../domain/factories/reservation.factory';
import { ReservationProducer } from '../../domain/producers';
import { OutboxAdapter } from '../../domain/adapters';
import { ReservationMapper } from '../../infrastructure/mappers/reservation.mapper';
import { ScheduleRepositoryImpl } from '../../infrastructure/repositories/schedule.repository';
import { DomainError } from '../../../../../libs/common/src/errors';

// Exceeded timeout of 5000 ms for a test.
jest.setTimeout(10_000);

const services = [
  ReservationService,
  SeatService,
  PointService,
  PaymentService,
  QueueService,
];

const factories = [ReservationFactory];

const repositories = [
  {
    provide: ReservationRepository,
    useClass: ReservationRepositoryImpl,
  },
  {
    provide: EventRepository,
    useClass: EventRepositoryImpl,
  },
  {
    provide: SeatRepository,
    useClass: SeatRepositoryImpl,
  },
  {
    provide: PointRepository,
    useClass: PointRepositoryImpl,
  },
  {
    provide: PaymentRepository,
    useClass: PaymentRepositoryImpl,
  },
  {
    provide: QueueRepository,
    useClass: QueueRepositoryImpl,
  },
  {
    provide: ScheduleRepository,
    useClass: ScheduleRepositoryImpl,
  },
];

const mappers = [ReservationMapper];

const producers = [
  {
    provide: ReservationProducer,
    useClass: ReservationProducerImpl,
  },
];

const adapters = [
  {
    provide: OutboxAdapter,
    useClass: OutboxAdapterImpl,
  },
];

const fixtures = [ActiveQueueUserSeeder];

describe('PayReservationUseCase (Integration)', () => {
  let payReservationUseCase: PayReservationUseCase;
  let app: INestApplication;
  let users: PointEntity[];
  let reservations: ReservationEntity[];
  let onlyOneReservation: ReservationEntity;

  const size = 10;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestCoreModule],
      providers: [
        PayReservationUseCase,
        ...services,
        ...factories,
        ...repositories,
        ...mappers,
        ...producers,
        ...adapters,
        ...fixtures,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    payReservationUseCase = moduleRef.get(PayReservationUseCase);

    const dataSource = moduleRef.get<DataSource>(getDataSourceToken());
    const activeQueueUserSeeder = moduleRef.get(ActiveQueueUserSeeder);

    users = await Promise.all(
      Array.from({ length: size }).map(() => seedPoint({ dataSource })),
    );

    await Promise.all(
      users.map((user) =>
        activeQueueUserSeeder.execute({ userId: user.userId }),
      ),
    );

    reservations = await Promise.all(
      users.map((user) =>
        seedReservation({
          dataSource,
          userId: user.userId,
        }),
      ),
    );

    onlyOneReservation = await seedReservation({
      dataSource,
      userId: users[0].userId,
    });
  });

  afterEach(async () => {
    await app.close();
  });

  describe('예약 결제 (Concurrency Testing)', () => {
    it('동시에 충전과 결제를 수행합니다.', async () => {
      const promises = users.map((user, i) =>
        payReservationUseCase.execute({
          userId: user.userId,
          reservationId: reservations[i].id,
        }),
      );

      const result = await Promise.all(promises);

      await expect(result.length).toBe(size);
    });

    it('동시에 같은 예약을 결제하려고 할 때, 하나의 결제만 성공해야 합니다.', async () => {
      const promises = [users[0], users[0], users[0]].map((user) =>
        payReservationUseCase.execute({
          userId: user.userId,
          reservationId: onlyOneReservation.id,
        }),
      );

      await expect(Promise.all(promises)).rejects.toThrow(
        DomainError.conflict('이미 결제된 좌석입니다.'),
      );
    });
  });
});
