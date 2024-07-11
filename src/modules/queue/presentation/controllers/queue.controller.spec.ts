import { mock, MockProxy } from 'jest-mock-extended';
import { ResponseEntity } from '../../../../lib/response';
import { GenerateTokenUsecase } from '../../application/usecases';
import { TokenResponse } from '../dto/responses';
import { QueueController } from './queue.controller';

describe('QueueController', () => {
  let generateTokenUseCase: MockProxy<GenerateTokenUsecase>;
  let controller: QueueController;

  beforeEach(() => {
    generateTokenUseCase = mock<GenerateTokenUsecase>();
    controller = new QueueController(generateTokenUseCase);

    generateTokenUseCase.execute.mockResolvedValue('token');
  });

  it('대기열 토큰 생성', async () => {
    const userId = '1';

    const result = await controller.generateToken({ userId });

    expect(result).toEqual(ResponseEntity.okWith(TokenResponse.of('token')));
  });
});
