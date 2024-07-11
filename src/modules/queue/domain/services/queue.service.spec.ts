import { mock, MockProxy } from 'jest-mock-extended';
import { QueueRepository } from '../repositories';
import { QueueService } from './queue.service';
import { Queue } from '../models';

const queue = Queue.create({ userId: '1' });

describe('QueueService', () => {
  let service: QueueService;
  let queueRepository: MockProxy<QueueRepository>;

  beforeEach(() => {
    queueRepository = mock<QueueRepository>();
    service = new QueueService(queueRepository);

    queueRepository.create.mockResolvedValue(queue);
  });

  describe('대기열 토큰 생성', () => {
    it('대기열 토큰을 생성합니다.', async () => {
      const userId = '1';

      const result = await service.enqueue(userId);

      expect(result).toEqual(queue);
    });
  });
});
