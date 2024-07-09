import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from './config';

const options: DataSourceOptions & SeederOptions = {
  type: config.database.type,
  database: config.database.name,
  username: config.database.username,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  seeds: ['typeorm/seeds/**/*{.ts,.js}'],
  factories: ['typeorm/factories/**/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
};

export const dataSource = new DataSource(options);
