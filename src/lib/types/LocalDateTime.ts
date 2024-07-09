import {
  convert,
  LocalDateTime as JodaDateTime,
  LocalDate,
  LocalTime,
  nativeJs,
} from '@js-joda/core';

export class LocalDateTime {
  constructor(private readonly value: JodaDateTime) {}

  static now = (): LocalDateTime => new LocalDateTime(JodaDateTime.now());

  static of = (date: LocalDate, time: LocalTime): LocalDateTime =>
    new LocalDateTime(JodaDateTime.of(date, time));

  static parse = (value: string): LocalDateTime =>
    new LocalDateTime(JodaDateTime.parse(value));

  static fromDate = (value: Date): LocalDateTime =>
    new LocalDateTime(nativeJs(value).toLocalDateTime());

  toDate = (): Date => convert(this.value).toDate();

  toString = (): string => this.value.toString();
}
