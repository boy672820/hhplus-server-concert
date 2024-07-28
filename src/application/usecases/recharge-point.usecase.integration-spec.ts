import { seedPoint } from '@lib/fixtures';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RechargePointUseCase } from './recharge-point.usecase';
import { TestCoreModule } from '../../core/test-core.module';
import { PointService } from '../../domain/services';
import { PointRepository } from '../../domain/repositories';
import { PointRepositoryImpl } from '../../infrastructure/repositories/point.repository';
import { PointEntity } from '../../infrastructure/entities/point.entity';

jest.setTimeout(300_000);

describe('RechargePointUseCase (Integration)', () => {
  let app: INestApplication;
  let rechargePointUseCase: RechargePointUseCase;
  let pointRepository: PointRepository;
  let user: PointEntity;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestCoreModule],
      providers: [
        RechargePointUseCase,
        PointService,
        {
          provide: PointRepository,
          useClass: PointRepositoryImpl,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    rechargePointUseCase = moduleRef.get(RechargePointUseCase);
    pointRepository = moduleRef.get(PointRepository);

    const dataSource = moduleRef.get<DataSource>(getDataSourceToken());

    user = await seedPoint({ dataSource });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('포인트 충전 (Concurrency Testing)', () => {
    it('동시에 1,000명의 사용자가 포인트를 충전한다.', async () => {
      await Promise.all(
        Array.from({ length: 1_000 }, () =>
          rechargePointUseCase.execute({ userId: user.userId, amount: '1' }),
        ),
      );

      const updatedUser = await pointRepository.findByUserId(user.userId);
      const amount = updatedUser?.balance.toString();
      expect(amount).toBe('101000');
    });
  });
});
