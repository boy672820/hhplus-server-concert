export interface KafkaClientOptions {
  brokers: string[];
}

export interface KafkaClientAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => KafkaClientOptions;
  inject?: any[];
}
