export interface OpensearchOptions {
  url: string;
}

export interface OpensearchAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<OpensearchOptions> | OpensearchOptions;
  inject?: any[];
  imports?: any[];
}
