import { UserPoint } from '../../domain/models';
import { UserPointEntity } from '../entities/user-point.entity';

export class UserPointMapper {
  static toModel = (entity: UserPointEntity): UserPoint =>
    UserPoint.from({
      userId: entity.userId,
      balance: entity.balance,
      updatedDate: entity.updatedDate,
    });

  static toEntity = (model: UserPoint): UserPointEntity => ({
    userId: model.userId,
    balance: model.balance,
    updatedDate: model.updatedDate,
  });
}
