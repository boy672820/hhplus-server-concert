import { AppConfigModule, AppConfigService } from '@config/app';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigModule, DatabaseConfigService } from '@config/database';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { join } from 'path';
import { OptimisticLockingSubscriber } from './optimistic-locking.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule, DatabaseConfigModule],
      useFactory: (
        appConfig: AppConfigService,
        databaseConfig: DatabaseConfigService,
      ) => ({
        type: databaseConfig.type,
        host: databaseConfig.host,
        port: databaseConfig.port,
        username: databaseConfig.username,
        password: databaseConfig.password,
        database: databaseConfig.database,
        entities: [join(__dirname, '/../../**/*.entity{.ts,.js}')],
        charset: 'utf8mb4_general_ci',
        synchronize: ['development', 'debug'].includes(appConfig.nodeEnv),
        migrationsTableName: 'typeorm_migrations',
        migrations: [join(__dirname, '/../../typeorm/migrations/*{.ts,.js}')],
        subscribers: [OptimisticLockingSubscriber],
        logging: appConfig.nodeEnv === 'debug',
      }),
      inject: [AppConfigService, DatabaseConfigService],
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
        addTransactionalDataSource(dataSource);
        return dataSource;
      },
    }),
  ],
})
export class DatabaseModule {}
