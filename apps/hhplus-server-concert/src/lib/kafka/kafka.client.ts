import { Observable } from 'rxjs';

export interface Event<T = any> {
  toJSON(): T;
}

export abstract class KafkaClient {
  abstract emit<TResult = any, TInput extends Event = Event>(
    topic: string,
    event: TInput,
  ): Observable<TResult>;
}
