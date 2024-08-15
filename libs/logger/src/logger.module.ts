import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.label({ label: 'hhplus-concert' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const httpTransport = new winston.transports.Console({
  level: 'http',
  format: winston.format.combine(
    winston.format.printf(
      ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`,
    ),
  ),
});

const errorTransport = new winston.transports.File({
  filename: 'logs/errors.log',
  level: 'error',
  format: winston.format.combine(
    winston.format.printf(
      ({ level, message, label, timestamp, error }) =>
        `${timestamp} [${label}] ${level}: ${message}${error ? `\n${error.stack}` : ''}`,
    ),
  ),
});

const infoTransport = new winston.transports.File({
  filename: 'logs/combine.log',
  level: 'info',
  format: winston.format.combine(
    winston.format.printf(
      ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`,
    ),
  ),
});

@Module({
  imports: [
    WinstonModule.forRoot({
      format,
      transports: [httpTransport, errorTransport, infoTransport],
    }),
  ],
})
export class LoggerModule {}
