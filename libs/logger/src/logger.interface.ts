import { transport } from 'winston';

export interface LoggerModuleOptions {
  appName?: string;
  environment?: 'development' | 'debug' | 'production' | 'test' | 'local';
  transports?: transport[];
  opensearchUrl: string;
}

export interface LoggerModuleAsyncOptions {
  global?: boolean;
  imports?: any[];
  useFactory: (...args: any[]) => LoggerModuleOptions;
  inject?: any[];
}
