import { TransactionStatus } from '../../domain/src/types';
import { Transaction } from './transaction.model';

describe('Transaction', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = Transaction.create();
  });

  describe('진행', () => {
    it('트랜잭션을 진행시킵니다.', () => {
      transaction.progress();

      expect(transaction.status).toBe(TransactionStatus.Progressing);
    });

    describe('진행이 실패하는 경우', () => {
      it('이미 진행된 트랜잭션은 진행할 수 없습니다.', () => {
        transaction.progress();

        expect(() => transaction.progress()).toThrow();
      });
    });
  });

  describe('완료', () => {
    it('트랜잭션을 완료시킵니다.', () => {
      transaction.success();

      expect(transaction.status).toBe(TransactionStatus.Completed);
    });

    describe('완료가 실패하는 경우', () => {
      it('진행되지 않은 트랜잭션은 완료할 수 없습니다.', () => {
        expect(() => transaction.success()).toThrow();
      });
    });
  });
});
