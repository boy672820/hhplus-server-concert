import { Queue } from '../../domain/models';
import { QueueEntity } from '../entities/queue.entity';

export class QueueMapper {
  static toModel = (entity: QueueEntity): Queue =>
    Queue.from({
      sequence: entity.sequence,
      userId: entity.userId,
      status: entity.status,
      expiresDate: entity.expiresDate,
    });

  static toEntity(model: Queue): QueueEntity {
    const entity = new QueueEntity();
    entity.sequence = model.sequence;
    entity.userId = model.userId;
    entity.status = model.status;
    entity.expiresDate = model.expiresDate;
    return entity;
  }
}
