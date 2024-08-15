import { TransactionStatus } from '@libs/domain/types';
import { ulid } from 'ulid';

interface Props {
  id: string;
  status: TransactionStatus;
}

export class Transaction {
  private _id: string;
  private _status: TransactionStatus;

  get id(): string {
    return this._id;
  }

  get status(): TransactionStatus {
    return this._status;
  }

  private constructor(props: Props) {
    this._id = props.id;
    this._status = props.status;
  }

  static create = (): Transaction =>
    new Transaction({ id: ulid(), status: TransactionStatus.Pending });

  static from = (props: Props): Transaction => new Transaction(props);
}
