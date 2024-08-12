import { Payment } from '../models';

export abstract class PaymentRepository {
  abstract save(payment: Payment): Promise<void>;
}
