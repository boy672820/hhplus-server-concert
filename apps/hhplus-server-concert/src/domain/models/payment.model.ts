import { LocalDateTime } from '@libs/domain/types';
import Decimal from 'decimal.js';

interface Props {
  reservationId: string;
  amount: Decimal;
  createdDate: LocalDateTime;
}

export class Payment implements Props {
  reservationId: string;
  amount: Decimal;
  createdDate: LocalDateTime;

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static create = (props: Pick<Props, 'reservationId' | 'amount'>) =>
    new Payment({ ...props, createdDate: LocalDateTime.now() });

  static from = (props: Props) => new Payment(props);
}
