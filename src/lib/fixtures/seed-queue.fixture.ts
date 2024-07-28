import { DataSource } from 'typeorm';
import { QueueEntity } from '../../infrastructure/entities/queue.entity';
import { LocalDateTime, QueueStatus } from '../types';

export const seedQueue = async ({
  dataSource,
  userId,
}: {
  dataSource: DataSource;
  userId: string;
}) => {
  const queue = new QueueEntity();
  queue.userId = userId;
  queue.status = QueueStatus.Active;
  queue.expiresDate = LocalDateTime.now().plusMinutes(30);

  await dataSource.manager.save(queue);

  return queue;
};
