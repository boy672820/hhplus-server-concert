import { Point } from '../models';

export abstract class PointRepository {
  abstract findByUserId(userId: string): Promise<Point | null>;
  abstract save(point: Point): Promise<void>;
}
