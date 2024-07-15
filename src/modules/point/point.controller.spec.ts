import { ResponseEntity } from '@lib/response';
import { PointController } from './point.controller';
import { PointResponse } from './dto/responses';
import { PointService } from './point.service';
import { MockProxy, mock } from 'jest-mock-extended';
import { PointEntity } from './point.entity';

const point = PointEntity.of({
  userId: '1',
  balance: '100',
  updatedDate: new Date(),
});

describe('PointController', () => {
  let controller: PointController;
  let pointService: MockProxy<PointService>;

  beforeEach(async () => {
    pointService = mock<PointService>();
    pointService.find.mockResolvedValue(point);
    pointService.charge.mockResolvedValue(point);
    controller = new PointController(pointService);
  });

  it('내 포인트를 조회합니다.', async () => {
    // Given
    const user = { userId: '1' };

    // When
    const result = await controller.my(user);

    // Then
    const entity = PointEntity.of({
      userId: '1',
      balance: '100',
      updatedDate: expect.any(Date),
    });
    expect(result).toEqual(ResponseEntity.okWith(PointResponse.from(entity)));
  });

  it('포인트를 충전합니다.', async () => {
    // Given
    const user = { userId: '1' };
    const amount = '100000';

    // When
    const result = await controller.charge(user, { amount });

    // Then
    const entity = PointEntity.of({
      userId: '1',
      balance: '100',
      updatedDate: expect.any(Date),
    });
    expect(result).toEqual(ResponseEntity.okWith(PointResponse.from(entity)));
  });
});
