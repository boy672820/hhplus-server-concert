import {
  convert,
  Instant,
  LocalDateTime as JodaDateTime,
  LocalDate,
  LocalTime,
  nativeJs,
  ZoneId,
} from '@js-joda/core';
import '@js-joda/timezone';

export class LocalDateTime {
  constructor(private readonly value: JodaDateTime) {}

  static max = (): LocalDateTime => new LocalDateTime(JodaDateTime.MAX);

  static now = (): LocalDateTime => new LocalDateTime(JodaDateTime.now());

  static of = (date: LocalDate, time: LocalTime): LocalDateTime =>
    new LocalDateTime(JodaDateTime.of(date, time));

  static verify = (value: string): boolean => {
    try {
      JodaDateTime.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  static parse = (value: string): LocalDateTime =>
    new LocalDateTime(JodaDateTime.parse(value));

  static fromDate = (value: Date): LocalDateTime =>
    new LocalDateTime(nativeJs(value).toLocalDateTime());

  static ofEpochMilli = (epochMilli: number): LocalDateTime =>
    new LocalDateTime(JodaDateTime.ofInstant(Instant.ofEpochMilli(epochMilli)));

  toDate = (zoneId?: string): Date =>
    convert(this.value, zoneId ? ZoneId.of(zoneId) : undefined).toDate();

  toString = (): string => this.value.toString();

  plusSeconds = (seconds: number): LocalDateTime =>
    new LocalDateTime(this.value.plusSeconds(seconds));

  plusMinutes = (minutes: number): LocalDateTime =>
    new LocalDateTime(this.value.plusMinutes(minutes));

  minusMinutes = (minutes: number): LocalDateTime =>
    new LocalDateTime(this.value.minusMinutes(minutes));

  toEqual = (other: LocalDateTime): boolean => this.value.equals(other.value);

  isBeforeNow = (): boolean => this.value.isBefore(JodaDateTime.now());

  toEpochMilli = (): number =>
    this.value.atZone(ZoneId.of('Asia/Seoul')).toInstant().toEpochMilli();
}
