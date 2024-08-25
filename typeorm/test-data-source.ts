import { entities } from '@libs/database/entities';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { join } from 'path';
import { config } from './test-config';

const options: DataSourceOptions & SeederOptions = {
  type: config.database.type,
  database: config.database.name,
  username: config.database.username,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  migrationsTableName: 'typeorm_migrations',
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
  seeds: ['typeorm/seeds/**/*{.ts,.js}'],
  factories: ['typeorm/factories/**/*{.ts,.js}'],
  entities,
};

export const dataSource = new DataSource(options);
