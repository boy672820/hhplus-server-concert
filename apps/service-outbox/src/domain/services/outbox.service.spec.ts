import { mock, MockProxy } from 'jest-mock-extended';
import { OutboxAdapter } from '../adapters';
import { OutboxService } from './outbox.service';
import { Transaction } from '../models';

const transaction = Transaction.create();

describe('OutboxService', () => {
  let outboxAdapter: MockProxy<OutboxAdapter>;
  let service: OutboxService;

  beforeEach(() => {
    outboxAdapter = mock<OutboxAdapter>();
    service = new OutboxService(outboxAdapter);

    outboxAdapter.getTransaction.mockResolvedValue(transaction);
  });

  describe('트랜잭션 실행', () => {
    it('트랜잭션을 실행합니다.', async () => {
      const spyOnProgress = jest.spyOn(transaction, 'progress');

      await service.progressTransaction('transactionId');

      expect(spyOnProgress).toHaveBeenCalled();
      expect(outboxAdapter.save).toHaveBeenCalledWith(transaction);
    });

    describe('트랜잭션 실행이 실패하는 경우', () => {
      it('트랜잭션을 가져오지 못하였습니다.', async () => {
        outboxAdapter.getTransaction.mockResolvedValueOnce(null);

        await expect(
          service.progressTransaction('transactionId'),
        ).rejects.toThrow();
      });
    });
  });
});
