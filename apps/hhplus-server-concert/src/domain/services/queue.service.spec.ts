import { LocalDateTime, QueueStatus } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { mock, MockProxy } from 'jest-mock-extended';
import { QueueRepository } from '../repositories';
import { QueueService } from './queue.service';
import { Queue } from '../models';

const queue = Queue.from({
  userId: '1',
  sequence: 1,
  status: QueueStatus.Active,
  expiresDate: LocalDateTime.now().plusMinutes(5),
});

describe('QueueService', () => {
  let service: QueueService;
  let queueRepository: MockProxy<QueueRepository>;

  beforeEach(() => {
    queueRepository = mock<QueueRepository>();
    service = new QueueService(queueRepository);

    queueRepository.create.mockResolvedValue(queue);
    queueRepository.findLastestByUserId.mockResolvedValue(queue);
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
        queueRepository.findLastestByUserId.mockResolvedValue(null);

        await expect(service.verify(queue)).rejects.toThrow(
          DomainError.notFound('사용자를 찾을 수 없습니다.'),
        );
      });
    });
  });

  describe('대기열 토큰 만료', () => {
    it('대기열 토큰을 만료시킵니다.', async () => {
      const spyOnExpire = jest.spyOn(queue, 'expire');

      await service.expire(queue.userId);

      expect(spyOnExpire).toHaveBeenCalled();
      expect(queueRepository.save).toHaveBeenCalledWith(queue);
    });

    describe('다음의 경우 만료에 실패합니다.', () => {
      it('사용자를 찾을 수 없을 경우', async () => {
        queueRepository.findLastestByUserId.mockResolvedValue(null);

        await expect(service.expire(queue.userId)).rejects.toThrow(
          DomainError.notFound('사용자를 찾을 수 없습니다.'),
        );
      });
    });
  });

  describe('대기중인 사용자 활성화', () => {
    it('대기중인 사용자를 활성화합니다.', async () => {
      const activeCount = 0;
      const users = [queue];
      const spyOnActivate = jest.spyOn(queue, 'activate');

      queueRepository.getActiveCount.mockResolvedValueOnce(activeCount);
      queueRepository.findWaitingUsersByLimit.mockResolvedValueOnce(users);

      await service.activateQueueUsers();

      expect(spyOnActivate).toHaveBeenCalled();
      expect(queueRepository.save).toHaveBeenCalledWith(users);
    });

    it('대기중인 사용자가 없을 경우, 활성화하지 않습니다.', async () => {
      const activeCount = 11;

      queueRepository.getActiveCount.mockResolvedValueOnce(activeCount);

      await service.activateQueueUsers();

      expect(queueRepository.findWaitingUsersByLimit).not.toHaveBeenCalled();
      expect(queueRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('활성화된 사용자 비활성화', () => {
    it('활성화된 사용자를 비활성화합니다.', async () => {
      const activeUsers = [queue];
      const spyOnExpire = jest.spyOn(queue, 'expire');

      queueRepository.findActiveUsers.mockResolvedValueOnce(activeUsers);

      await service.expireQueueUsers();

      expect(spyOnExpire).toHaveBeenCalled();
      expect(queueRepository.save).toHaveBeenCalledWith(activeUsers);
    });
  });
});
