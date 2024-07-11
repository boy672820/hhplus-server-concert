import { LocalDateTime } from '@lib/types';
import { Queue } from './queue.model';

describe('QueueModel', () => {
  let queue: Queue;

  beforeEach(() => {
    queue = Queue.from({
      sequence: 1,
      userId: '1',
      isAvailable: false,
      expiresDate: LocalDateTime.now().plusMinutes(5),
    });
  });

  describe('대기열 토큰 생성', () => {
    it('대기열 토큰을 생성합니다.', () => {
      const token = queue.generateToken();
      const decoded = Buffer.from(token, 'base64').toString('utf-8').split(':');

      expect(decoded).toEqual([queue.sequence.toString(), queue.userId]);
    });
  });
});
