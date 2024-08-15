import { mock, MockProxy } from 'jest-mock-extended';
import { OutboxService } from './outbox.service';
import { TransactionRepository } from '../repositories';
import { Transaction } from '../models';

describe('OutboxService', () => {
  let transactionRepository: MockProxy<TransactionRepository>;
  let service: OutboxService;

  beforeEach(() => {
    transactionRepository = mock<TransactionRepository>();
    service = new OutboxService(transactionRepository);
  });

  describe('트랜잭션 생성', () => {
    it('트랜잭션을 생성합니다.', async () => {
      const result = await service.createTransaction();

      expect(result).toBeInstanceOf(Transaction);
      expect(transactionRepository.save).toHaveBeenCalled();
    });
  });
});
