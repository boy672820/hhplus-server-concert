import { Point } from '../../domain/models';
import { PointEntity } from '../entities/point.entity';

export class PointMapper {
  static toModel = (entity: PointEntity): Point =>
    Point.from({
      userId: entity.userId,
      balance: entity.balance,
      updatedDate: entity.updatedDate,
    });

  static toEntity = (model: Point): PointEntity => {
    const entity = new PointEntity();
    entity.userId = model.userId;
    entity.balance = model.balance;
    entity.updatedDate = model.updatedDate;
    return entity;
  };
}
