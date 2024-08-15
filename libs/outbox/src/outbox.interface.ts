export interface OutboxModuleOptions {
  redis: {
    host: string;
    port: number;
  };
}

export interface OutboxModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => OutboxModuleOptions;
  inject?: any[];
}
