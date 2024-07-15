import { Queue } from '../../domain/models';
import { QueueEntity } from '../entities/queue.entity';

export class QueueMapper {
  static toModel = (entity: QueueEntity): Queue =>
    Queue.from({
      sequence: entity.sequence,
      userId: entity.userId,
      isAvailable: entity.isAvailable,
      expiresDate: entity.expiresDate,
    });

  static toEntity(model: Queue): QueueEntity {
    const entity = new QueueEntity();
    entity.sequence = model.sequence;
    entity.userId = model.userId;
    entity.isAvailable = model.isAvailable;
    entity.expiresDate = model.expiresDate;
    return entity;
  }
}
