export interface RedisModuleOptions {
  host: string;
  port: number;
}

export interface RedisModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => RedisModuleOptions;
  inject?: any[];
}
