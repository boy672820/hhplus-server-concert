import { SeatStatus } from '@libs/domain/types';
import { seedPoint, seedSeat } from '@lib/fixtures';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TestCoreModule } from '../../core/test-core.module';
import { ReserveUseCase } from './reserve.usecase';
import { ReservationService, SeatService } from '../../domain/services';
import {
  EventRepository,
  ReservationRepository,
  SeatRepository,
} from '../../domain/repositories';
import { SeatRepositoryImpl } from '../../infrastructure/repositories/seat.repository';
import { ReservationRepositoryImpl } from '../../infrastructure/repositories/reservation.repository';
import { EventRepositoryImpl } from '../../infrastructure/repositories/event.repository';
import { SeatEntity } from '@libs/database/entities';
import { PointEntity } from '@libs/database/entities';

describe('ReserveUseCase (Integration)', () => {
  let app: INestApplication;
  let reserveUseCase: ReserveUseCase;
  let seatRepository: SeatRepository;
  let seat: SeatEntity;
  let users: PointEntity[];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestCoreModule],
      providers: [
        ReserveUseCase,
        SeatService,
        ReservationService,
        {
          provide: SeatRepository,
          useClass: SeatRepositoryImpl,
        },
        {
          provide: ReservationRepository,
          useClass: ReservationRepositoryImpl,
        },
        {
          provide: EventRepository,
          useClass: EventRepositoryImpl,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    reserveUseCase = moduleRef.get(ReserveUseCase);
    seatRepository = moduleRef.get(SeatRepository);

    await app.init();

    const dataSource = moduleRef.get<DataSource>(getDataSourceToken());

    seat = await seedSeat({ dataSource });
    users = await Promise.all(
      Array.from({ length: 1_000 }, () => seedPoint({ dataSource })),
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe('좌석 예약 (Concurrency Testing)', () => {
    it('동시에 같은 좌석을 예약하려고 할 때, 하나의 예약만 성공해야 한다.', async () => {
      const seatId = seat.id;

      await expect(
        Promise.all(
          users.map(({ userId }) => reserveUseCase.execute({ userId, seatId })),
        ),
      ).rejects.toThrow();

      const assignedSeat = await seatRepository.findById(seatId);

      expect(assignedSeat?.status).toBe(SeatStatus.InProgress);
    });
  });
});
