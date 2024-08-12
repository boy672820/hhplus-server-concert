import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from './test-config';
import { join } from 'path';

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
  entities: ['src/**/*.entity{.ts,.js}'],
};

export const dataSource = new DataSource(options);
