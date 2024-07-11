import {
  convert,
  LocalDateTime as JodaDateTime,
  LocalDate,
  LocalTime,
  nativeJs,
  ZoneId,
} from '@js-joda/core';
import '@js-joda/timezone';

export class LocalDateTime {
  constructor(private readonly value: JodaDateTime) {}

  static now = (): LocalDateTime => new LocalDateTime(JodaDateTime.now());

  static of = (date: LocalDate, time: LocalTime): LocalDateTime =>
    new LocalDateTime(JodaDateTime.of(date, time));

  static parse = (value: string): LocalDateTime =>
    new LocalDateTime(JodaDateTime.parse(value));

  static fromDate = (value: Date): LocalDateTime =>
    new LocalDateTime(nativeJs(value).toLocalDateTime());

  toDate = (zoneId?: string): Date =>
    convert(this.value, zoneId ? ZoneId.of(zoneId) : undefined).toDate();

  toString = (): string => this.value.toString();

  plusMinutes = (minutes: number): LocalDateTime =>
    new LocalDateTime(this.value.plusMinutes(minutes));
}
