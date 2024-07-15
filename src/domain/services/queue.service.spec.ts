import { LocalDateTime } from '@lib/types';
import { DomainError } from '@lib/errors';
import { mock, MockProxy } from 'jest-mock-extended';
import { QueueRepository } from '../repositories';
import { QueueService } from './queue.service';
import { Queue } from '../models';

const queue = Queue.from({
  userId: '1',
  sequence: 1,
  isAvailable: true,
  expiresDate: LocalDateTime.now().plusMinutes(5),
});

describe('QueueService', () => {
  let service: QueueService;
  let queueRepository: MockProxy<QueueRepository>;

  beforeEach(() => {
    queueRepository = mock<QueueRepository>();
    service = new QueueService(queueRepository);

    queueRepository.create.mockResolvedValue(queue);
    queueRepository.findByUserId.mockResolvedValue(queue);
  });

  describe('대기열 토큰 생성', () => {
    it('대기열 토큰을 생성합니다.', async () => {
      const userId = '1';

      const result = await service.enqueue(userId);

      expect(result).toEqual(queue);
    });
  });

  describe('대기열 토큰 파싱', () => {
    it('대기열 토큰을 파싱합니다.', () => {
      const token = queue.sign();

      const result = service.parse(token);

      expect(result).toBeInstanceOf(Queue);
    });
  });

  describe('대기열 토큰 검증', () => {
    it('대기열 토큰을 검증합니다.', async () => {
      const result = await service.verify(queue);

      expect(result).toBeInstanceOf(Queue);
    });

    describe('다음의 경우 검증에 실패합니다.', () => {
      it('사용자를 찾을 수 없을 경우', async () => {
        queueRepository.findByUserId.mockResolvedValue(null);

        await expect(service.verify(queue)).rejects.toThrow(
          DomainError.notFound('사용자를 찾을 수 없습니다.'),
        );
      });
    });
  });
});