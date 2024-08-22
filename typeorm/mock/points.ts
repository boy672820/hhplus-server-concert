import { PointEntity } from '@libs/database/entities';
import { LocalDateTime } from '@libs/domain/types';
import Decimal from 'decimal.js';

let id = 1;

const createUserPoint = (): PointEntity => {
  const entity = new PointEntity();
  entity.userId = id.toString();
  entity.balance = new Decimal(100_000);
  entity.updatedDate = LocalDateTime.now();

  id += 1;

  return entity;
};

export const userPoints = Array.from({ length: 10_000 }, createUserPoint);