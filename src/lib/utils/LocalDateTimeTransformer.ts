import { ValueTransformer } from 'typeorm';
import { LocalDateTime } from '../types';

export class LocalDateTimeTransformer implements ValueTransformer {
  to(value: LocalDateTime): Date {
    if (!value) {
      return value;
    }
    const date = value.toDate('UTC');
    return date;
  }

  from(databaseValue: Date): LocalDateTime {
    if (!databaseValue) {
      return databaseValue;
    }
    return LocalDateTime.fromDate(databaseValue);
  }
}
