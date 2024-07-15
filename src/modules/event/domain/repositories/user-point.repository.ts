import { UserPoint } from '../models';

export abstract class UserPointRepository {
  abstract findById(userId: string): Promise<UserPoint | null>;
  abstract save(userPoint: UserPoint): Promise<void>;
}
