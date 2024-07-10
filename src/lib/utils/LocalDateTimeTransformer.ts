import { ValueTransformer } from 'typeorm';
import { LocalDateTime } from '../types';

export class LocalDateTimeTransformer implements ValueTransformer {
  to(value: LocalDateTime): Date {
    const date = value.toDate('UTC');
    return date;
  }

  from(databaseValue: Date): LocalDateTime {
    return LocalDateTime.fromDate(databaseValue);
  }
}
