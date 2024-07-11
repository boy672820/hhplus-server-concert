import { LocalDateTime } from '@lib/types';

interface Props {
  sequence: number;
  userId: string;
  isAvailable: boolean;
  expiresDate: LocalDateTime;
}

export class Queue implements Props {
  sequence: number;
  userId: string;
  isAvailable: boolean;
  expiresDate: LocalDateTime;

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static create = ({ userId }: Pick<Props, 'userId'>): Queue =>
    new Queue({
      sequence: 1,
      userId,
      isAvailable: false,
      expiresDate: LocalDateTime.now().plusMinutes(5),
    });

  static from = (props: Props): Queue => new Queue(props);

  generateToken = (): string =>
    Buffer.from(`${this.sequence}:${this.userId}`).toString('base64');
}
