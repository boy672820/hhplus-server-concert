import { LocalDateTime, QueueStatus } from '@libs/domain/types';
import { DomainError } from '../../lib/errors';

interface Props {
  sequence: number;
  userId: string;
  status: QueueStatus;
  expiresDate: LocalDateTime;
}

export class Queue implements Props {
  sequence: number;
  userId: string;
  status: QueueStatus;
  expiresDate: LocalDateTime;

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static create = ({ userId }: Pick<Props, 'userId'>): Queue =>
    new Queue({
      sequence: 1,
      userId,
      status: QueueStatus.Waiting,
      expiresDate: LocalDateTime.now().plusMinutes(5),
    });

  static from = (props: Props): Queue => new Queue(props);

  static parse = (token: string): Queue =>
    Buffer.from(token, 'base64')
      .toString('utf-8')
      .split('@')
      .reduce(
        (queue, value, index) => {
          switch (index) {
            case 0:
              queue.sequence = Number(value);
              return queue;
            case 1:
              queue.userId = value;
              return queue;
            case 2:
              queue.expiresDate = LocalDateTime.parse(value);
              return queue;
            default:
              return queue;
          }
        },
        Queue.from({
          sequence: 0,
          userId: '',
          expiresDate: LocalDateTime.now(),
          status: QueueStatus.Waiting,
        }),
      )
      .validate();

  sign = (): string =>
    Buffer.from(
      `${this.sequence}@${this.userId}@${this.expiresDate.toString()}`,
    ).toString('base64');

  validate(): Queue {
    if (Number.isNaN(this.sequence) && this.userId === '') {
      throw DomainError.forbidden('잘못된 대기열 토큰입니다.');
    }

    return this;
  }

  checkAvailable(): boolean {
    if (this.expiresDate.isBeforeNow()) {
      throw DomainError.forbidden('만료된 대기열 토큰입니다.');
    }

    if (this.status === QueueStatus.Waiting) {
      throw DomainError.forbidden('아직 순번이 아닙니다.');
    }

    return true;
  }

  activate(): void {
    this.status = QueueStatus.Active;
  }

  expire(): void {
    if (this.expiresDate.isBeforeNow()) {
      this.status = QueueStatus.Expired;
    }
  }
}
