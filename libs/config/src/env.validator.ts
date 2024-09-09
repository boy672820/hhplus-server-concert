import { DatabaseType, Environment } from '@libs/domain/types';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  validateSync,
} from 'class-validator';

export enum EnvKey {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',

  DATABASE_TYPE = 'DATABASE_TYPE',
  DATABASE_NAME = 'DATABASE_NAME',
  DATABASE_HOST = 'DATABASE_HOST',
  DATABASE_PORT = 'DATABASE_PORT',
  DATABASE_USERNAME = 'DATABASE_USERNAME',
  DATABASE_PASSWORD = 'DATABASE_PASSWORD',

  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',

  KAFKA_HOST = 'KAFKA_HOST',
  KAFKA_PORT = 'KAFKA_PORT',

  OPENSEARCH_URL = 'OPENSEARCH_URL',
}

class EnviromentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsNumber()
  PORT: number;

  @IsEnum(DatabaseType)
  DATABASE_TYPE: DatabaseType;
  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;
  @IsNumber()
  @IsPositive()
  DATABASE_PORT: number;
  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;
  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME: string;
  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;
  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  @IsNotEmpty()
  KAFKA_HOST: string;
  @IsNumber()
  KAFKA_PORT: number;

  @IsString()
  @IsNotEmpty()
  OPENSEARCH_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnviromentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
