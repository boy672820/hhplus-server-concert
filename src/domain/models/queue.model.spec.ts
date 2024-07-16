import { LocalDateTime } from '@lib/types';
import { Queue } from './queue.model';
import { DomainError } from '../../lib/errors';

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
      const token = queue.sign();
      const decoded = Buffer.from(token, 'base64').toString('utf-8').split('@');

      expect(decoded).toEqual([
        queue.sequence.toString(),
        queue.userId,
        queue.expiresDate.toString(),
      ]);
    });
  });

  describe('대기열 토큰 파싱', () => {
    it('대기열 토큰을 파싱합니다.', () => {
      const token = queue.sign();
      const parsed = Queue.parse(token);

      expect(parsed.sequence).toBe(queue.sequence);
      expect(parsed.userId).toBe(queue.userId);
      expect(parsed.expiresDate.toEqual(queue.expiresDate)).toBeTruthy();
    });

    describe('대기열 토큰 파싱 실패', () => {
      it('잘못된 형식의 대기열 토큰을 파싱합니다.', () => {
        const wrongToken = 'wrong-token';

        expect(() => Queue.parse(wrongToken)).toThrow(
          DomainError.forbidden('잘못된 대기열 토큰입니다.'),
        );
      });
    });
  });

  describe('대기열 토큰 유효성 검사', () => {
    it('대기열 토큰이 유효합니다.', () => {
      queue.available();

      expect(queue.validate()).toEqual(queue);
    });

    describe('다음의 경우 유효성 검사에 실패합니다.', () => {
      it('대기열 토큰이 만료되었습니다.', () => {
        queue.expiresDate = LocalDateTime.now().minusMinutes(1);

        expect(() => queue.checkAvailable()).toThrow(
          DomainError.forbidden('만료된 대기열 토큰입니다.'),
        );
      });

      it('대기열 토큰이 아직 순번이 아닙니다.', () => {
        queue.isAvailable = false;

        expect(() => queue.checkAvailable()).toThrow(
          DomainError.forbidden('아직 순번이 아닙니다.'),
        );
      });
    });
  });

  describe('대기열 유효하게 만들기', () => {
    it('대기열을 유효하게 만듭니다.', () => {
      queue.isAvailable = true;

      expect(queue.isAvailable).toBeTruthy();
    });
  });
});
