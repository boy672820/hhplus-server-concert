import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { userPoints } from '../mock/points';

export class PointSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    await dataSource.manager.save(userPoints);
  }
}
