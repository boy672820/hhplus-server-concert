import { ValueTransformer } from 'typeorm';
import { LocalDateTime } from '../types';

export class LocalDateTimeTransformer implements ValueTransformer {
  to(value: LocalDateTime): Date {
    if (!value) {
      return value;
    }
    const date = value.toDate('Asia/Seoul');
    return date;
  }

  from(databaseValue: Date): LocalDateTime {
    if (!databaseValue) {
      return databaseValue;
    }
    return LocalDateTime.fromDate(databaseValue);
  }
}
