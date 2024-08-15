import { LocalDateTime, TransactionStatus } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { ulid } from 'ulid';

interface Props {
  id: string;
  status: TransactionStatus;
  createdDate: LocalDateTime;
  updatedDate: LocalDateTime;
}

export class Transaction {
  private _id: string;
  private _status: TransactionStatus;
  private _createdDate: LocalDateTime;
  private _updatedDate: LocalDateTime;

  get id(): string {
    return this._id;
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get createdDate(): LocalDateTime {
    return this._createdDate;
  }

  get updatedDate(): LocalDateTime {
    return this._updatedDate;
  }

  protected constructor(props: Props) {
    this._id = props.id;
    this._status = props.status;
    this._createdDate = props.createdDate;
  }

  static create = (): Transaction =>
    new Transaction({
      id: ulid(),
      status: TransactionStatus.Pending,
      createdDate: LocalDateTime.now(),
      updatedDate: LocalDateTime.now(),
    });

  static from = (props: Props): Transaction => new Transaction(props);

  progress(): void {
    if (this._status !== TransactionStatus.Pending) {
      throw DomainError.conflict('이미 발행된 트랜잭션입니다.');
    }

    this._status = TransactionStatus.Progressing;
    this._updatedDate = LocalDateTime.now();
  }
}
