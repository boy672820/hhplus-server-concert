import { mock, MockProxy } from 'jest-mock-extended';
import { QueueService } from './queue.service';
import { QueueRepository } from '../repositories';
import { QueueUser } from '../models';

describe('QueueService', () => {
  let service: QueueService;
  let queueRepository: MockProxy<QueueRepository>;

  beforeEach(() => {
    queueRepository = mock<QueueRepository>();
    service = new QueueService(queueRepository);

    queueRepository.enqueue.mockResolvedValue();
  });

  describe('대기열 입장', () => {
    it('대기열에 사용자를 추가합니다.', async () => {
      const userId = 'user-id';

      const result = await service.enterUser(userId);

      expect(result).toBeInstanceOf(QueueUser);
      expect(queueRepository.enqueue).toHaveBeenCalled();
    });
  });

  describe('토큰 서명', () => {
    it('토큰을 서명합니다.', () => {
      const queue = QueueUser.createWaiting({ userId: '1' });

      const result = service.sign(queue);

      expect(result).toBe(queue.sign());
    });
  });

  describe('토큰 검증', () => {
    it('토큰을 검증합니다.', async () => {
      const token = QueueUser.createActive({ userId: '1' }).sign();

      const result = await service.verifyToken(token);

      const expected = QueueUser.parse(token);
      expect(result.userId).toEqual(expected.userId);
      expect(result.expiresDate.toEqual(expected.expiresDate)).toBeTruthy();
    });
  });

  describe('활성 사용자 확인', () => {
    it('활성 사용자를 확인합니다.', async () => {
      const userId = 'user-id';
      const user = QueueUser.createActive({ userId });
      queueRepository.getActiveUser.mockResolvedValueOnce(user);

      const result = await service.checkActive(userId);

      expect(result).toBe(user);
      expect(queueRepository.getActiveUser).toHaveBeenCalledWith(userId);
    });

    it('활성 사용자를 찾는데 실패할 경우', async () => {
      const userId = 'user-id';
      queueRepository.getActiveUser.mockResolvedValueOnce(null);

      await expect(service.checkActive(userId)).rejects.toThrow();
    });
  });

  describe('활성 사용자 만료', () => {
    it('활성 사용자를 만료시키는데 실패할 경우', async () => {
      const userId = 'user-id';
      queueRepository.dequeueActive.mockResolvedValueOnce(null);

      await expect(service.expire(userId)).rejects.toThrow();
    });
  });

  describe('대기열 사용자 활성화', () => {
    it('대기열 사용자를 활성화합니다.', async () => {
      const users = [QueueUser.createWaiting({ userId: '1' })];
      queueRepository.dequeueWaitingByLimit.mockResolvedValueOnce(users);

      const result = await service.activateQueueUsers();

      expect(result).toBe(users);
      expect(queueRepository.activate).toHaveBeenCalledWith(users);
    });
  });

  describe('대기열 사용자 만료', () => {
    it('대기열 사용자를 만료합니다.', async () => {
      const count = 1;
      queueRepository.expire.mockResolvedValueOnce({ count });

      const result = await service.expireQueueUsers();

      expect(result).toEqual({ count });
    });
  });
});
