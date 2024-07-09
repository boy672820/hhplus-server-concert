import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { events, schedules, seats } from '../mock/events';

export class EventSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    await dataSource.manager.transaction(async (manager) => {
      await manager.save(events);
      await manager.save(schedules);
      await manager.save(seats);
    });
  }
}
