import { LocalDateTime } from '@libs/domain/types';
import { DataSource } from 'typeorm';
import Decimal from 'decimal.js';
import { ulid } from 'ulid';
import { PointEntity } from '@libs/database/entities';

export const seedPoint = async ({
  dataSource,
}: {
  dataSource: DataSource;
}): Promise<PointEntity> => {
  const point = new PointEntity();
  point.userId = ulid();
  point.balance = new Decimal(100_000);
  point.updatedDate = LocalDateTime.now();

  await dataSource.manager.save(point);

  return point;
};
