import { DataSource } from 'typeorm';
import { QueueEntity } from '@libs/database/entities';
import { LocalDateTime, QueueStatus } from '@libs/domain/types';

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
