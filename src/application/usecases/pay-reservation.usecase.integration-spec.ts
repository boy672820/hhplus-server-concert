import { seedPoint, seedQueue, seedReservation } from '@lib/fixtures';
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
import { PointEntity } from '../../infrastructure/entities/point.entity';
import { ReservationEntity } from '../../infrastructure/entities/reservation.entity';
import {
  EventRepository,
  PaymentRepository,
  PointRepository,
  QueueRepository,
  ReservationRepository,
  SeatRepository,
} from '../../domain/repositories';
import { ReservationRepositoryImpl } from '../../infrastructure/repositories/reservation.repository';
import { EventRepositoryImpl } from '../../infrastructure/repositories/event.repository';
import { SeatRepositoryImpl } from '../../infrastructure/repositories/seat.repository';
import { PointRepositoryImpl } from '../../infrastructure/repositories/point.repository';
import { PaymentRepositoryImpl } from '../../infrastructure/repositories/payment.repositor';
import { QueueRepositoryImpl } from '../../infrastructure/repositories/queue.repository';

describe('PayReservationUseCase (Integration)', () => {
  let payReservationUseCase: PayReservationUseCase;
  let app: INestApplication;
  let user: PointEntity;
  let reservation1: ReservationEntity;
  let reservation2: ReservationEntity;
  let reservation3: ReservationEntity;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestCoreModule],
      providers: [
        PayReservationUseCase,
        ReservationService,
        SeatService,
        PointService,
        PaymentService,
        QueueService,
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
      ],
    }).compile();

    payReservationUseCase = moduleRef.get(PayReservationUseCase);

    app = moduleRef.createNestApplication();
    await app.init();

    const dataSource = moduleRef.get<DataSource>(getDataSourceToken());

    user = await seedPoint({ dataSource });
    [reservation1, reservation2, reservation3] = await Promise.all([
      seedReservation({
        dataSource,
        userId: user.userId,
      }),
      seedReservation({
        dataSource,
        userId: user.userId,
      }),
      seedReservation({
        dataSource,
        userId: user.userId,
      }),
    ]);
    await seedQueue({ dataSource, userId: user.userId });
  });

  afterEach(async () => {
    await app.close();
  });

  describe('예약 결제 (Concurrency Testing)', () => {
    it('동시에 충전과 결제를 수행합니다.', async () => {
      await expect(
        Promise.all([
          payReservationUseCase.execute({
            userId: user.userId,
            reservationId: reservation1.id,
          }),
          payReservationUseCase.execute({
            userId: user.userId,
            reservationId: reservation2.id,
          }),
          payReservationUseCase.execute({
            userId: user.userId,
            reservationId: reservation3.id,
          }),
        ]),
      ).rejects.toThrow();
    });
  });
});
