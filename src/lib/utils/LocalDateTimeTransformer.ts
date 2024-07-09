import { ValueTransformer } from 'typeorm';
import { LocalDateTime } from '../types';

export class LocalDateTimeTransformer implements ValueTransformer {
  to(value: LocalDateTime): Date {
    return value.toDate();
  }

  from(databaseValue: Date): LocalDateTime {
    return LocalDateTime.fromDate(databaseValue);
  }
}
