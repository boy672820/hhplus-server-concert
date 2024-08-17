import { LocalDateTime, QueueUserStatus } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';

interface Props {
  userId: string;
  expiresDate: LocalDateTime;
  status: QueueUserStatus;
}

export class QueueUser {
  private _userId: string;
  private _expiresDate: LocalDateTime;
  private _status: QueueUserStatus;

  get userId() {
    return this._userId;
  }

  get expiresDate() {
    return this._expiresDate;
  }

  get status() {
    return this._status;
  }

  private constructor(props: Props) {
    this._userId = props.userId;
    this._expiresDate = props.expiresDate;
  }

  static ACTIVE_LIMIT = 1000;

  static createWaiting = (props: Pick<Props, 'userId'>) =>
    new QueueUser({
      ...props,
      expiresDate: LocalDateTime.now().plusMinutes(5),
      status: QueueUserStatus.Waiting,
    });

  static createActive = (props: Pick<Props, 'userId'>) =>
    new QueueUser({
      ...props,
      expiresDate: LocalDateTime.max(),
      status: QueueUserStatus.Active,
    });

  static from = (props: Props) => new QueueUser(props);

  static parse(token: string): { userId: string; expiresDate: LocalDateTime } {
    const [userId, expiresDate] = Buffer.from(token, 'base64')
      .toString('utf-8')
      .split('@');

    if (!userId || !expiresDate || !LocalDateTime.verify(expiresDate)) {
      throw DomainError.unauthorized('Invalid token');
    }

    if (LocalDateTime.parse(expiresDate).isBeforeNow()) {
      throw DomainError.unauthorized('Token expired');
    }

    return { userId, expiresDate: LocalDateTime.parse(expiresDate) };
  }

  sign = (): string =>
    Buffer.from(`${this._userId}@${this._expiresDate}`).toString('base64');
}
