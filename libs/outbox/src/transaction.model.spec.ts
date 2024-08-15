import { Transaction } from './transaction.model';

describe('Transaction', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = Transaction.create();
  });

  describe('진행', () => {
    it('트랜잭션을 진행시킵니다.', () => {
      transaction.progress();

      expect(transaction.status).toBe('progressing');
    });

    describe('진행이 실패하는 경우', () => {
      it('이미 진행된 트랜잭션은 진행할 수 없습니다.', () => {
        transaction.progress();

        expect(() => transaction.progress()).toThrow();
      });
    });
  });
});
