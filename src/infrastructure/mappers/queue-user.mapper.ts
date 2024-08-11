import { QueueUser } from '../../domain/models';

export class QueueUserMapper {
  static createActive = (userId: string): QueueUser =>
    QueueUser.createActive({ userId });
}
