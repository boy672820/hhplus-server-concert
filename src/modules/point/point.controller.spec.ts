import { ResponseEntity } from '@lib/response';
import { PointController } from './point.controller';
import { PointResponse } from './dto/responses';

describe('PointController', () => {
  let pointController: PointController;

  beforeEach(async () => {
    pointController = new PointController();
  });

  it('내 포인트를 조회합니다.', async () => {
    // Given
    const user = { userId: '1' };

    // When
    const result = await pointController.my(user);

    // Then
    expect(result).toEqual(
      ResponseEntity.okWith(PointResponse.of({ balance: '235000' })),
    );
  });

  it('포인트를 충전합니다.', async () => {
    // Given
    const user = { userId: '1' };
    const amount = 100000;

    // When
    const result = await pointController.charge(user, { amount });

    // Then
    expect(result).toEqual(
      ResponseEntity.okWith(PointResponse.of({ balance: '335000' })),
    );
  });
});
