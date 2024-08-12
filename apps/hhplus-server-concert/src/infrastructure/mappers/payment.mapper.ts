import { PaymentEntity } from '@libs/database/entities';
import { Payment } from '../../domain/models';

export class PaymentMapper {
  static toModel = (entity: PaymentEntity): Payment =>
    Payment.from({
      reservationId: entity.reservationId,
      amount: entity.amount,
      createdDate: entity.createdDate,
    });

  static toEntity(model: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.reservationId = model.reservationId;
    entity.amount = model.amount;
    entity.createdDate = model.createdDate;
    return entity;
  }
}
