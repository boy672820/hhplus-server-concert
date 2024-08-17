import {
  EventType,
  LocalDateTime,
  TransactionStatus,
} from '@libs/domain/types';
import { Transaction } from './transaction.model';

describe('Transaction', () => {
  describe('재시도', () => {
    it('트랜잭션이 "대기" 중이고, 생성된지 1분이 지났다면 재시도할 수 있다.', () => {
      const createdDate = LocalDateTime.now().minusMinutes(2);
      const transaction = Transaction.from({
        id: '1',
        type: EventType.ReservationReservedSeat,
        status: TransactionStatus.Pending,
        createdDate,
        updatedDate: createdDate,
      });

      const result = transaction.autoRetry();

      expect(result).toBe(true);
    });

    describe('다음의 경우 재시도할 수 없다.', () => {
      it('트랜잭션이 생성된지 1분이 지나지 않았을 경우', () => {
        const createdDate = LocalDateTime.now();
        const transaction = Transaction.from({
          id: '1',
          type: EventType.ReservationReservedSeat,
          status: TransactionStatus.Pending,
          createdDate,
          updatedDate: createdDate,
        });

        const result = transaction.autoRetry();

        expect(result).toBe(false);
      });
    });
  });
});
