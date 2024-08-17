import {
  EventType,
  LocalDateTime,
  TransactionStatus,
} from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { AggregateRoot } from '@nestjs/cqrs';
import { ulid } from 'ulid';

interface Props {
  id: string;
  type: EventType;
  status: TransactionStatus;
  payload: string;
  createdDate: LocalDateTime;
  updatedDate: LocalDateTime;
}

export class Transaction extends AggregateRoot {
  private _id: string;
  private _type: EventType;
  private _status: TransactionStatus;
  private _payload: string;
  private _createdDate: LocalDateTime;
  private _updatedDate: LocalDateTime;

  get id(): string {
    return this._id;
  }

  get type(): EventType {
    return this._type;
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get payload(): string {
    return this._payload;
  }

  get createdDate(): LocalDateTime {
    return this._createdDate;
  }

  get updatedDate(): LocalDateTime {
    return this._updatedDate;
  }

  protected constructor(props: Props) {
    super();
    this._id = props.id;
    this._type = props.type;
    this._status = props.status;
    this._payload = props.payload;
    this._createdDate = props.createdDate;
    this._updatedDate = props.updatedDate;
  }

  static create = (
    type: EventType,
    payload: Record<string, any>,
  ): Transaction => {
    const id = ulid();
    return new Transaction({
      id,
      type,
      payload: JSON.stringify({ ...payload, transactionId: id }),
      status: TransactionStatus.Pending,
      createdDate: LocalDateTime.now(),
      updatedDate: LocalDateTime.now(),
    });
  };

  static from = (props: Props): Transaction => new Transaction(props);

  progress(): void {
    if (this._status !== TransactionStatus.Pending) {
      throw DomainError.conflict('이미 발행된 트랜잭션입니다.');
    }

    this._status = TransactionStatus.Progressing;
    this._updatedDate = LocalDateTime.now();
  }

  success(): void {
    if (this._status !== TransactionStatus.Progressing) {
      throw DomainError.conflict('진행되지 않은 트랜잭션입니다.');
    }

    this._status = TransactionStatus.Completed;
    this._updatedDate = LocalDateTime.now();
  }

  getPrevStatus(): TransactionStatus {
    switch (this._status) {
      case TransactionStatus.Pending:
        throw DomainError.conflict('이전 상태가 존재하지 않습니다.');
      case TransactionStatus.Progressing:
        return TransactionStatus.Pending;
      case TransactionStatus.Completed:
        return TransactionStatus.Progressing;
      default:
        throw DomainError.conflict('알 수 없는 상태입니다.');
    }
  }

  getPayload = (): Record<string, any> => JSON.parse(this._payload);
}
