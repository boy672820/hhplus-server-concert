import { LocalDateTime } from '@lib/types';
import { DomainError } from '@lib/errors';
import { QueueUser } from './queue-user.model';

const signToken = (userId: string, expiresDate: string) =>
  Buffer.from(`${userId}@${expiresDate}`).toString('base64');

describe('QueueUser', () => {
  // let queueUser: QueueUser;

  // beforeEach(() => {
  //   queueUser = QueueUser.create();
  // });

  describe('토큰 서명(발행)', () => {
    it('토큰을 생성합니다.', () => {
      const userId = '1';
      const queueUser = QueueUser.createWaiting({ userId });

      const result = queueUser.sign();

      const [sub] = Buffer.from(result, 'base64')
        .toString('utf-8')
        .split('@') as [string, number, LocalDateTime];
      expect(sub).toBe(userId);
    });
  });

  describe('토큰 파싱', () => {
    it('토큰을 파싱합니다.', () => {
      const userId = '1';
      const expiresDate = LocalDateTime.now().plusMinutes(5);
      const token = signToken(userId, expiresDate.toString());

      const result = QueueUser.parse(token);

      expect(result.userId).toBe(userId);
      expect(result.expiresDate.toEqual(expiresDate)).toBeTruthy();
    });

    describe('토큰 파싱에 실패하는 경우', () => {
      it('토큰이 유효하지 않은 경우', () => {
        const token = 'invalid-token';

        expect(() => QueueUser.parse(token)).toThrow(
          DomainError.unauthorized('Invalid token'),
        );
      });

      it('만료일이 유효하지 않은 경우', () => {
        const userId = '1';
        const expiresDate = 'invalid-date';
        const token = signToken(userId, expiresDate);

        expect(() => QueueUser.parse(token)).toThrow(
          DomainError.unauthorized('Invalid token'),
        );
      });

      it('토큰이 만료된 경우', () => {
        const userId = '1';
        const expiresDate = LocalDateTime.now().minusMinutes(1);
        const token = signToken(userId, expiresDate.toString());

        expect(() => QueueUser.parse(token)).toThrow(
          DomainError.unauthorized('Token expired'),
        );
      });
    });
  });
});
